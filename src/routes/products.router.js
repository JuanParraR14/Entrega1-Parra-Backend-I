import { Router } from "express";
import { io } from "../app.js";
import Product from "../models/Product.js";

const router = Router();

//  GET /api/products  Query params:
router.get("/", async (req, res) => {
   try {

      const { limit = 10, page = 1, sort, query } = req.query;

      const options = {
         limit: parseInt(limit),
         page: parseInt(page),
         lean: true
      };

      if (sort) {
         options.sort = { price: sort === "asc" ? 1 : -1};
      }

      let filter = {};

      if (query) {
         const [field, value] = query.split(":");

         if (field === "status") {
            filter[field] = value === "true";
         } else {
            filter [field] = value;
         }
      }

      const result = await Product.paginate(filter, options);

      const response = {
         status: "success",
         payload: result.docs,
         totalPages: result.totalPages,
         prevPage: result.prevPage,
         nextPage: result.nextPage,
         page: result.page,
         hasPrevPage: result.hasPrevPage,
         hasNextPage: result.hasNextPage,
         prevLink: result.hasPrevPage
            ? `/api/products?page=${result.prevPage}`
            : null,
         nextLink : result.hasNextPage
            ? `/api/products?page=${result.nextPage}`
            : null   
      };

      res.json(response);
   } catch (error) {
      res.status(500).json({
         status: "error",
         error: error.message
      });
   }
});

// GET producto por ID
router.get("/:pid", async (req, res) => {
   try {

      const product = await Product.findById(req.params.pid).lean();

      if (!product) {
         return res.status(404).json({ error: "Producto no encontrado" });
      }

      res.json(product);

   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// POST crear producto
router.post("/", async (req, res) => {
   try {
      
      const newProduct = await Product.create(req.body);

      const products = await Product.find().lean();
      io.emit("updateProducts", products);

      res.status(201).json(newProduct);

   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// PUT actualizar producto
router.put("/:pid", async (req, res) => {
   try {

      const updated = await Product.findByIdAndUpdate(
         req.params.pid,
         req.body,
         { new: true }
      );

      if (!updated) {
         return res.status(404).json({ error: "Producto no encontrado" });
      }

      res.json(updated);

   }  catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// DELETE producto
router.delete("/:pid", async (req, res) => {
   try {

      const deleted = await Product.findByIdAndDelete(req.params.pid);

      if (!deleted) {
         return res.status(404).json({ error: "Producto no encontrado" });
      }

      const products = await Product.find().lean();
      io.emit("updateProducts", products);

   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

export default router;