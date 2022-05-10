import {AnyEventHandlerMap, project, WrapToAny} from "./common";
import {Execute, Ignore} from "./compiled/proto/project";

export type ValidResult = Ignore | Execute;

export const execute = <T>(eventType: string, handler: (event: T) => string): AnyEventHandlerMap => {
    return project<T>(
        eventType,
        e => {
            const update = {sql: handler(e)};
            return WrapToAny(Execute.fromPartial(update));
        });
};
