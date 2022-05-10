import {AnyEventHandlerMap, project, WrapToAny} from "./common";
import {Execute} from "./compiled/proto/project";

export const execute = <T>(eventType: string, handler: (event: T) => string): AnyEventHandlerMap =>
    project<T>(
        eventType,
        e => {
            const update = {sql: handler(e)};
            return Execute.fromPartial(update);
        });
