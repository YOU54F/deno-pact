export class Product {
  id: string;
  type: string;
  name: string;
  version: string;
  constructor(id: string, type: string, name: string, version: string) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.version = version;
  }
}
