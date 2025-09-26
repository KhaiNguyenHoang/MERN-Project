import Product from "../models/product.model.js";
import mongoose from "mongoose";
import express from "express";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      code: 200,
      status: "success",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};

export const getSingleProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Invalid product ID",
    });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Product not found",
      });
    }
    res.status(200).json({
      code: 200,
      status: "success",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Invalid product ID",
    });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Product not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: "success",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Invalid product ID",
    });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Product not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, image } = req.body;
    if (!name || !price || !image) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Please provide all the required fields (name, price, image)",
      });
    }

    const newProduct = new Product({ name, price, image });
    await newProduct.save();

    res.status(201).json({
      code: 201,
      status: "success",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
