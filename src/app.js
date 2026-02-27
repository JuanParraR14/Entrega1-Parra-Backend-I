import express from "express";
import { engine } from "express-handlebars";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";


import ProductManager from "./managers/ProductManager.js";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer);

const PORT = 8080;
const productManager = new ProductManager("./src/data/products.json"); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//Router de Vistas
app.get("/", async (req, res) => {
   const products = await productManager.getProducts();
   res.render("home", { products });
});

app.get("/realtimeproducts", async (req, res) => {
   const products = await productManager.getProducts();
   res.render("realTimeProducts", { products });
});

// WebSocket Completo
io.on("connection", (socket) => {
   console.log("Cliente conectado exitosamente");

   socket.on("addProduct", async (product) => {
      await productManager.addProduct(product);
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
   });

   socket.on("deleteProduct", async (id) => {
      await productManager.deleteProduct(id);
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
   });
});

httpServer.listen(PORT, () => {
   console.log(`Servidor escuchando en puerto ${PORT}`);
});