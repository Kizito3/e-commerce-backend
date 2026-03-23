import type { Response } from "express";
import { AuthRequest } from "./../middleware/_auth";
import { uploadToCloudinary } from "../utils/uploader";
import Product from "../models/_product";
import mongoose from "mongoose";

// create product for admin only
export async function createProduct(req: AuthRequest, res: Response) {
  try {
    // destructure the formdata coming from the request body ={req.body}
    const { name, description, price, discountPrice, category, stock, sold } =
      req.body as {
        name: string;
        description: string;
        price: number;
        discountPrice: number;
        category: string;
        stock: number;
        sold: number;
      };

    // run the necessary checks needed
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // multiple images
    let productImageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.path, "ecommerce/products"),
      );
      const results = await Promise.all(uploadPromises);
      productImageUrls = results.map((r) => r.url);
    }
    // create the product
    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      category,
      stock,
      sold,
      images: productImageUrls,
    });

    return res
      .status(201)
      .json({ Status: true, message: "Product created successfully", product });
  } catch (error) {
    console.error("createProduct error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProducts(req: AuthRequest, res: Response) {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      minPrice,
      maxPrice,
    } = req.query as {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      minPrice?: number;
      maxPrice?: number;
    };

    const query: Record<string, any> = {};

    // search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }
    // filter by minprice and maxprice
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("getProducts error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
