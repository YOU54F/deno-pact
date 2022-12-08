import { ProductRepository } from "./product.repository.ts";

export const repository = new ProductRepository();

export const getAll =  (
  _req: any,
  res: any
) => {
  res.json( repository.fetchAll());
};

export const getById =  (
  req: { params: { id: number } },
  res: any
) => {
  let product;
  if (typeof req.params.id === "string") {
    product =  repository.getById(Number(req.params.id));
  } else {
    product =  repository.getById(req.params.id);
  }
  product
    ? res.json(product)
    : res.sendStatus(404).json({ message: "Product not found" });
};
