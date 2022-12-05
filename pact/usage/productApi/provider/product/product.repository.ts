import { Product } from "./product.ts";

export class ProductRepository {
  products: Map<number, Product>;
  constructor() {
    this.products = new Map([
      [9, new Product("09", "CREDIT_CARD", "Gem Visa", "v1")],
      [10, new Product("10", "CREDIT_CARD", "28 Degrees", "v1")],
      [11, new Product("11", "PERSONAL_LOAN", "MyFlexiPay", "v2")]
    ]);
  }

  async fetchAll() {
    return [...this.products.values()];
  }

  async getById(id: number) {
    return this.products.get(id);
  }
}
