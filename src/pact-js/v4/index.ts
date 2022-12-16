import {Buffer}from "https://deno.land/std@0.167.0/io/buffer.ts";

import { ConsumerPact } from '../pact.d.ts';
import {makeConsumerPact} from '../consumer.ts'
import { UnconfiguredInteraction } from './http/index.ts';
import { PactV4Options, V4UnconfiguredInteraction } from './http/types.ts';
import { V4ConsumerPact } from './types.ts';
// import { version as pactPackageVersion } from '../../package.json';
import { V4UnconfiguredSynchronousMessage } from './message/types.ts';
import { UnconfiguredSynchronousMessage } from './message/index.ts';

export class PactV4 implements V4ConsumerPact {
  private pact: ConsumerPact;

  constructor(private opts: PactV4Options) {
    // if (!Deno.env.get("ENABLE_FEATURE_V4")) {
    // // if (!process.env.ENABLE_FEATURE_V4) {
    //   throw Error(
    //     "The v4 package is currently in beta and requires the 'ENABLE_FEATURE_V4' environment variable to be set"
    //   );
    // }

    this.pact = makeConsumerPact(
      opts.consumer,
      opts.provider,
      opts.spec,
      opts.logLevel
    );

    this.pact.addMetadata('pact-js', 'version', 'pactPackageVersion');
  }

  addInteraction(): V4UnconfiguredInteraction {
    return new UnconfiguredInteraction(
      this.pact,
      this.pact.newInteraction(''),
      this.opts
    );
  }

  addSynchronousInteraction(
    description: string
  ): V4UnconfiguredSynchronousMessage {
    return new UnconfiguredSynchronousMessage(
      this.pact,
      this.pact.newSynchronousMessage(description),
      this.opts
    );
  }
}
