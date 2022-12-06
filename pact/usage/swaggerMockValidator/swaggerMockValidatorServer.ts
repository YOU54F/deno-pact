import express from "npm:express@4.18.2";
import { swaggerMockValidatorService } from "./swaggerMockValidatorService.ts";

const app = express();
app.use(express.json());
export const server = (port: number) => {
  console.log("listening on: ", port);
  const server = app.listen(port);
  return server;
};

app.post("/", async (req: any, res: any) => {
  console.log("got a req");
  const { body } = req;
  console.log("got a body", body);
  const results = await swaggerMockValidatorService(body);
  res.json(JSON.parse(results));
});

// deno run -A --unstable <path> --run --port 37757
import { parse } from "https://deno.land/std@0.119.0/flags/mod.ts";
const flags = parse(Deno.args, {
  boolean: ["run"],
  string: ["port"]
});
if (flags.run) {
  if (flags.port) {
    server(flags.port);
  } else {
    server(8000);
  }
}
