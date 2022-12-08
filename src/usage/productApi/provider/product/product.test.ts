import { express } from "../deps.ts";
import { router } from "./product.routes.ts";
import {
  describe,
  expect,
  it,
  run,
  beforeEach
} from "https://deno.land/x/tincan/mod.ts";
import { getAvailablePort } from "https://deno.land/x/port/mod.ts";

describe("Product API tests", () => {
  const app = express();

  beforeEach(() => {
    app.use(express.json());
    app.use(router);
  });

  describe("All products", () => {
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
      const port = await getAvailablePort();
      const server = app.listen(port);
      try {
        const response = await fetch(`http://localhost:${port}/products`);
        const actual = await response.json();
        server.close();
        const { headers, status } = response;
        console.log("response", { actual, expected, status, headers });
        expect(actual).toEqual(expected);
        expect(status).toEqual(200);
        expect(headers.get("content-type")).toEqual(
          "application/json; charset=utf-8"
        );
      } finally {
        server.close();
      }
    });
  });
  describe("Individual products", () => {
    // There is an async leak when run via act CI locally.
    // no issues running from my local machine
    it("Returns product by id", async () => {
      const expected = {
        id: "09",
        type: "CREDIT_CARD",
        name: "Gem Visa",
        version: "v1"
      };
      const port = await getAvailablePort();
      const server = app.listen(port);
      try {
        const response = await fetch(`http://localhost:${port}/product/9`);
        const actual = await response.json();
        server.close();
        const { headers, status } = response;
        console.log("response", { actual, expected, status, headers });
        expect(actual).toEqual(expected);
        expect(status).toEqual(200);
        expect(headers.get("content-type")).toEqual(
          "application/json; charset=utf-8"
        );
      } finally {
        server.close();
      }
    });
  });
});

run();
