import express from "express";
import cartsRouter from "./routes/carts.router";
import productsRouter from "./routes/products.router";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
   console.log(`Servidor escuchando en puerto ${PORT}`);
});