import express from 'npm:express';
import {Request,Response} from 'npm:@types/express';
import { swaggerMockValidatorService } from './swaggerMockValidatorService.ts';

export const app = express();
app.use(express.json());

app.post('/', async (req:Request, res:Response) => {
  console.log('got a req');
  const { body } = req;
  console.log('got a body', body);
  const results = await swaggerMockValidatorService(body);
  res.json(JSON.parse(results));
});

export const server = (port: number) => {
  const server = app.listen(port, () => {
    console.log('listening on: ', server.address());
  });
  return server;
};

// deno run -A --unstable <path> --run --port 3000
import { parse } from 'https://deno.land/std@0.119.0/flags/mod.ts';
const flags = parse(Deno.args, {
  boolean: ['run'],
  string: ['port']
});
if (flags.run) {
  if (flags.port) {
    server(flags.port);
  } else {
    server(3000);
  }
}
