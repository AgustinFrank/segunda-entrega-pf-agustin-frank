import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct(product) {
    const products = this.getProducts();
    const newProduct = {
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnails: product.thumbnails,
      code: product.code,
      stock: product.stock,
      category: product.category,
      status: product.status,
      id: product.id,
    };

    const checkExistence = products.findIndex(
      (product) => product.code === newProduct.code
    );

    if (checkExistence === -1) {
      products.push(newProduct);
    } else {
      throw new Error("El código del producto ya existe");
    }

    const dataToJson = JSON.stringify(products);
    fs.writeFileSync(this.path, dataToJson);
    return newProduct;
  }

  getProducts() {
    if (fs.existsSync(this.path)) {
      const data = fs.readFileSync(this.path, "utf-8");
      return JSON.parse(data);
    } else {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const index = await products.findIndex((product) => product.id === id);

    if (index === -1) {
      throw new Error("El ID no se ha encontrado en los productos.");
    } else {
      return products[index];
    }
  }

  async updateProduct(id, product) {
    const products = await this.getProducts();
    const index = await products.findIndex((product) => product.id === id);

    if (index === -1) {
      throw new Error("El ID no se ha encontrado");
    } else {
      const updatedProduct = { ...products[index], ...product, id };
      products.splice(index, 1, updatedProduct);
      const dataToJson = JSON.stringify(products);
      fs.writeFileSync(this.path, dataToJson);

      return updatedProduct;
    }
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const index = await products.findIndex((product) => product.id === id);

    if (index !== -1) {
      const productDeleted = await products.splice(index, 1);
      const dataToJson = JSON.stringify(products);
      fs.writeFileSync(this.path, dataToJson);
      return productDeleted;
    } else {
      throw new Error(
        "El ID ingresado no se encuentra dentro de los productos"
      );
    }
  }
}

const productManager = new ProductManager("./products.json");

export { ProductManager };
