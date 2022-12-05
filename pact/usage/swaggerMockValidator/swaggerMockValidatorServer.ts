import express from "npm:express@4.18.2";
import { swaggerMockValidatorService } from "./swaggerMockValidatorService.ts";

const app = express();
app.use(express.json());
export const server = (port: number) => {
  return app.listen(port);
};

app.post("/", async (req:any,res:any) => {
  console.log(req.body);
  const results = await swaggerMockValidatorService(req.body);
  res.send(results);
});

// deno run -A --unstable pact/usage/areaCalculator/areaCalculatorClient.ts --run --port 37757
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
