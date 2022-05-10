import * as grpc from "@grpc/grpc-js";
import {Ignore, ProjectionRequest, ProjectionResponse, ProjectionServer, ProjectionService} from "./compiled/proto/project";
import {Any} from "./compiled/google/protobuf/any";
import {messageTypeRegistry, UnknownMessage} from "./compiled/typeRegistry";

export interface EventHandler<T> {
    (event: T): UnknownMessage;
}

interface EventHandlerMap<T> {
    eventType: string;
    handler: EventHandler<T>;
}

export type AnyEventHandlerMap = EventHandlerMap<any>;

export type Projector = AnyEventHandlerMap[];

export function WrapToAny(event: UnknownMessage): Any {
    return Any.fromPartial({
        typeUrl: `/${event.$type}`,
        value: messageTypeRegistry.get(event.$type)!.encode(event).finish()
    });
}

export function project<T>(eventType: string, handler: EventHandler<T>): AnyEventHandlerMap {
    // @ts-ignore
    return {eventType, handler: x => handler(x as T)};
}

const getProjectionServer = (projector: Projector): ProjectionServer => {
    const projections = new Map(projector.map(obj => [obj.eventType, obj.handler]));
    const ignored: Any = WrapToAny(Ignore.fromJSON({}));
    return {
        project(call: grpc.ServerDuplexStream<ProjectionRequest, ProjectionResponse>): void {
            call.on("data", (ctx: ProjectionRequest) => {
                console.log(`(server) Got event: ${ctx.eventType}`);
                if (ctx.eventType == undefined) {
                    call.write({
                        eventId: ctx.eventId,
                        operation: ignored,
                        metadata: {},
                        $type: ProjectionResponse.$type
                    });
                } else {
                    const handler = projections.get(ctx.eventType);
                    if (handler) {
                        console.log(`(server) Invoking handler for event: ${ctx.eventType}`);
                        const result = ProjectionResponse.fromPartial({
                            eventId: ctx.eventId,
                            operation: WrapToAny(handler(ctx.eventPayload)),
                            metadata: {}
                        });
                        console.log(`(server) Responding with: ${result.operation?.$type}`);
                        call.write(result);
                    } else {
                        console.log(`(server) No handler found for event: ${ctx.eventType}`);
                    }
                }
            });
        }
    }
}

const getServer = (projector: Projector): grpc.Server => {
    const server = new grpc.Server();
    server.addService(ProjectionService, getProjectionServer(projector));
    return server;
};

export const runServer = (host: string, projector: Projector): void => {
    const server = getServer(projector);
    console.log(`(server) Starting server on ${host}`);
    server.bindAsync(
        host,
        grpc.ServerCredentials.createInsecure(),
        (err: Error | null, port: number) => {
            if (err) {
                console.error(`Server error: ${err.message}`);
            } else {
                console.log(`Server bound on port: ${port}`);
                server.start();
            }
        }
    );
}
