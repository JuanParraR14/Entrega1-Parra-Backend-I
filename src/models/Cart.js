import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
   products: [
      {
         product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
         },
         quantity: Number
      }
   ]
});

const Cart = mongoose.model("carts", cartSchema);

export default Cart;