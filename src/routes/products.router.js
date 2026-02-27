import { Router } from "express";
import { io } from "../app.js";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
   const products = await productManager.getProducts();
   res.json(products);
});

router.get("/:pid", async (req, res) => {
   const product = await productManager.getProductById(req.params.pid);
   if (!product) return res.status(404).json({ error: "Producto no encontrado" });
   res.json(product);
});

router.post("/", async (req, res) => {
   const newProduct = await productManager.addProduct(req.body);
   
   const products = await productManager.getProducts();
   io.emit("updateProducts", products);

   res.status(201).json(newProduct);
});

router.put("/:pid", async (req, res) => {
   const updated = await productManager.updateProduct(req.params.pid, req.body);
   if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
   res.json(updated);
});

router.delete("/:pid", async (req, res) => {
   await productManager.deleteProduct(req.params.pid);

   const products = await productManager.getProducts();
   io.emit("updateProducts", products);

   res.json({ message: "Producto eliminado" });
});

export default router;