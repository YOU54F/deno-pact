import { express } from "../deps.ts";
import { router } from "./product.routes.ts";
import {
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  run
} from "https://deno.land/x/tincan/mod.ts";

describe("Product API tests", () => {
  let server: any;

  beforeEach(() => {
    const app = express();
    app.use(express.json());
    app.use(router);
    server = app.listen(3000);
  });
  afterEach(() => {
    server.close();
  });

  describe("Happy path", () => {
    it("Returns all products", async () => {
      const expected = [
        {
          id: "09",
          type: "CREDIT_CARD",
          name: "Gem Visa",
          version: "v1"
        },
        {
          id: "10",
          type: "CREDIT_CARD",
          name: "28 Degrees",
          version: "v1"
        },
        {
          id: "11",
          type: "PERSONAL_LOAN",
          name: "MyFlexiPay",
          version: "v2"
        }
      ];
      const response = await fetch("hrttp://localhost:3000/products");
      const actual = await response.json();
      console.log("response", { actual, expected });
      expect(actual).toEqual(expected);
      expect(response.status).toEqual(200);
      expect(response.headers.get("content-type")).toEqual(
        "application/json; charset=utf-8"
      );
    });

    it("Returns product by id", async () => {
      const expected = {
        id: "09",
        type: "CREDIT_CARD",
        name: "Gem Visa",
        version: "v1"
      };
      const response = await fetch("http://localhost:3000/product/9");
      const actual = await response.json();
      console.log("response", { actual, expected });
      expect(actual).toEqual(expected);
      expect(response.status).toEqual(200);
      expect(response.headers.get("content-type")).toEqual(
        "application/json; charset=utf-8"
      );
    });
  });
});

run();
