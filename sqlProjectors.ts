import {AnyEventHandlerMap} from "./common";

export const execute = <T>(eventType: string, handler: (event: T) => string): AnyEventHandlerMap => {
    return {eventType, handler: e => ({ execute: {sql: handler(e)}})};
};
