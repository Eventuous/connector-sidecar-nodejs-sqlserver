// Original file: proto/project.proto

import type { ResponseContext as _projection_ResponseContext, ResponseContext__Output as _projection_ResponseContext__Output } from '../projection/ResponseContext';
import type { Ignore as _projection_Ignore, Ignore__Output as _projection_Ignore__Output } from '../projection/Ignore';
import type { Execute as _projection_Execute, Execute__Output as _projection_Execute__Output } from '../projection/Execute';

export interface ProjectionResult {
  'context'?: (_projection_ResponseContext | null);
  'ignore'?: (_projection_Ignore | null);
  'execute'?: (_projection_Execute | null);
  'operation'?: "ignore"|"execute";
}

export interface ProjectionResult__Output {
  'context': (_projection_ResponseContext__Output | null);
  'ignore'?: (_projection_Ignore__Output | null);
  'execute'?: (_projection_Execute__Output | null);
  'operation': "ignore"|"execute";
}
