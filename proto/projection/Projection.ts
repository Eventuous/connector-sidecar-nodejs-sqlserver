// Original file: proto/project.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ProjectionContext as _projection_ProjectionContext, ProjectionContext__Output as _projection_ProjectionContext__Output } from '../projection/ProjectionContext';
import type { ProjectionResult as _projection_ProjectionResult, ProjectionResult__Output as _projection_ProjectionResult__Output } from '../projection/ProjectionResult';

export interface ProjectionClient extends grpc.Client {
  Project(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_projection_ProjectionContext, _projection_ProjectionResult__Output>;
  Project(options?: grpc.CallOptions): grpc.ClientDuplexStream<_projection_ProjectionContext, _projection_ProjectionResult__Output>;
  project(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_projection_ProjectionContext, _projection_ProjectionResult__Output>;
  project(options?: grpc.CallOptions): grpc.ClientDuplexStream<_projection_ProjectionContext, _projection_ProjectionResult__Output>;
  
}

export interface ProjectionHandlers extends grpc.UntypedServiceImplementation {
  Project: grpc.handleBidiStreamingCall<_projection_ProjectionContext__Output, _projection_ProjectionResult>;
  
}

export interface ProjectionDefinition extends grpc.ServiceDefinition {
  Project: MethodDefinition<_projection_ProjectionContext, _projection_ProjectionResult, _projection_ProjectionContext__Output, _projection_ProjectionResult__Output>
}
