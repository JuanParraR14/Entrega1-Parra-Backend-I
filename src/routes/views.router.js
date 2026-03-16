import { Router } from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const router = Router();

// Vista de productos con paginación
router.get("/products", async (req, res) => {

   const { page = 1 } = req.query;

   const result = await Product.paginate({}, {
      page,
      limit: 10,
      lean: true
   });

   res.render("products", {
      products: result.docs,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result. hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage
   });

});

// Vista detalle de producto
router.get("/products/:pid", async (req, res) => {
   
   const product = await Product.findById(req.params.pid).lean();

   res.render("productDetail", {
      product 
   });

});

// Vista carrito
router.get("/carts/:cid", async (req, res) => {

   const cart = await Cart.findById(req.params.cid)
      .populate("products.product")
      .lean();

   res.render("cart", {
      products: cart.products
   });

});

// Validador de existencia carrito
router.get("/carts/:cid", async (req, res) => {

   const cart = await Cart.findById(req.params.cid)
      .populate("products.product")
      .lean();

   if (!cart) {
      return res.status(404).send("Carrito no encontrado");
   }

   res.render("cart", {
      products: cart.products
   });

});

export default router;