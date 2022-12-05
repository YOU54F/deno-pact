import { ProductRepository } from "./product.repository.ts";

export const repository = new ProductRepository();

export const getAll = async (
  _req: any,
  res: any
) => {
  res.json(await repository.fetchAll());
};

export const getById = async (
  req: { params: { id: number } },
  res: any
) => {
  let product;
  if (typeof req.params.id === "string") {
    product = await repository.getById(Number(req.params.id));
  } else {
    product = await repository.getById(req.params.id);
  }
  product
    ? res.json(product)
    : res.sendStatus(404).json({ message: "Product not found" });
};
