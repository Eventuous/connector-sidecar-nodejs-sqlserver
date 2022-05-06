import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ProjectionClient as _projection_ProjectionClient, ProjectionDefinition as _projection_ProjectionDefinition } from './projection/Projection';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  projection: {
    Execute: MessageTypeDefinition
    Ignore: MessageTypeDefinition
    Projection: SubtypeConstructor<typeof grpc.Client, _projection_ProjectionClient> & { service: _projection_ProjectionDefinition }
    ProjectionContext: MessageTypeDefinition
    ProjectionResult: MessageTypeDefinition
    ResponseContext: MessageTypeDefinition
  }
}

