import { Router } from "express";
import Cart from "../models/Cart.js";

const router = Router();

// Crear carrito
router.post("/", async (req, res) => {
   try {
      
      const newCart = await Cart.create({ products: [] });

      res.status (201).json(newCart);

   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Obtener carrito por ID con populate
router.get("/:cid", async (req, res) => {
   try {

      const cart = await Cart.findById(req.params.cid)
         .populate("products.product")
         .lean();

      if (!cart) {
         return res.status(404).json({ error: "Carrito no encontrado" });
      }

      res.json(cart.products);

   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
   try {

      const cart = await Cart.findById(req.params.cid);

      if (!cart) {
         return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const productIndex = cart.products.findIndex(
         p => p.product.toString() === req.params.pid
      );

      if (productIndex !== -1) {
         cart.products[productIndex].quantity++;
      } else {
         cart.products.push({
            product: req.params.pid,
            quantity: 1
         });
      }

      await cart.save();

      res.json(cart);

   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// DELETE producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
   try {

      const cart = await Cart.findById(req.params.cid);

      if (!cart) {
         return res.status(404).json({ error: "Carrito no encontrado" });
      }

      cart.products = cart.products.filter(
         p => p.product.toString() !== req.params.pid
      );

      await cart.save();

      res.json({ message: "Producto eliminado del carrito" });

   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// PUT actualizar TODOS los productos del carrito
router.put("/:cid", async (req, res) => {
   try {

      const updatedCart = await Cart.findByIdAndUpdate(
         req.params.cid,
         { products: req.body.products },
         { new: true }
      );

      if (!updatedCart) {
         return res.status(404).json({ error: "Carrito no encontrado "});
      }

      res.json(updatedCart);

   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// PUT actualizar cantidad de un producto
router.put("/:cid/products/:pid", async (req, res) => {
   try {

      const { quantity } = req.body;

      const cart = await Cart.findById(req.params.cid);

      if (!cart) {
         return res.status(404).json({ error: "Carrito no encontrado"});
      }

      const product = cart.products.find(
         p => p.product.toString() === req.params.pid 
      );

      if (!product) {
         return res.status(404).json({ error: "Producto no encontrado en carrito "});
      }

      product.quantity = quantity;

      await cart.save();

      res.json(cart);

   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// DELETE eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
   try {

      const cart = await Cart.findById(req.params.cid);

      if (!cart) {
         return res.status(404).json({ error: "Carrito no encontrado" });
      }

      cart.products = [];

      await cart.save();

      res.json({ message: "Carrito vaciado "});

   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

export default router;