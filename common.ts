import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import {ProtoGrpcType} from "./proto/project";
import {ProjectionHandlers} from "./proto/projection/Projection";
import {ProjectionContext} from "./proto/projection/ProjectionContext";
import {ProjectionResult} from "./proto/projection/ProjectionResult";
import {Ignore} from "./proto/projection/Ignore";

export interface EventHandler<T> {
    (event: T): ProjectionResult
}

interface EventHandlerMap<T> {
    eventType: string;
    handler: EventHandler<T>;
}

export type AnyEventHandlerMap = EventHandlerMap<any>;

export type Projector = AnyEventHandlerMap[];

const getProjectionServer = (projector: Projector): ProjectionHandlers => {
    const projections = new Map(projector.map(obj => [obj.eventType, obj.handler]));
    const ignored: Ignore = {};
    return {
        Project(call: grpc.ServerDuplexStream<ProjectionContext, ProjectionResult>): void {
            call.on("data", (ctx: ProjectionContext) => {
                console.log(`(server) Got event: ${ctx.eventType}`);
                if (ctx.eventType == undefined) {
                    call.write(ignored);
                } else {
                    const handler = projections.get(ctx.eventType);
                    if (handler) {
                        console.log(`(server) Invoking handler for event: ${ctx.eventType}`);
                        const payload = JSON.parse(ctx.eventJson as string);
                        const result = {...handler(payload), context: {eventId: ctx.eventId}};
                        console.log(`(server) Responding with: ${JSON.stringify(result)}`);
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
    const packageDefinition = protoLoader.loadSync('./proto/project.proto');
    const proto = grpc.loadPackageDefinition(
        packageDefinition
    ) as unknown as ProtoGrpcType;
    const server = new grpc.Server();
    server.addService(proto.projection.Projection.service, getProjectionServer(projector));
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
