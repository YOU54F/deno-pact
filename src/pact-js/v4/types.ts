import { V4UnconfiguredInteraction } from './http/types.ts';
import { V4UnconfiguredSynchronousMessage } from './message/types.ts';

export interface V4ConsumerPact {
  addInteraction(): V4UnconfiguredInteraction;
  // addAsynchronousInteraction(): V4UnconfiguredAsynchronousMessage;
  addSynchronousInteraction(
    description: string
  ): V4UnconfiguredSynchronousMessage;
}
