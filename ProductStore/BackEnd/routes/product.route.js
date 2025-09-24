import express from "express";
import {
  updateProduct,
  deleteProduct,
  createProduct,
  getAllProducts,
  getSingleProduct,
} from "../controllers/product.controrller.js";
const router = express.Router();

router.post("/api/products", createProduct);
router.get("/api/products", getAllProducts);
router.get("/api/products/:id", getSingleProduct);
router.patch("/api/products/:id", updateProduct);
router.delete("/api/products/:id", deleteProduct);

export default router;
