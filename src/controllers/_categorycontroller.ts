import type { Response } from "express";
import { AuthRequest } from "./../middleware/_auth";
import Category from "../models/_category";

export async function createCategory(req: AuthRequest, res: Response) {
  try {
    // destructure the formdata from the req.body
    const { name, description } = req.body as {
      name: string;
      description: string;
    };

    if (!name) {
      return res.status(400).json({
        status: false,
        message: "Category name is required",
      });
    }

    //   check if the category exists
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(409).json({
        status: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({ name, description });
    return res.status(201).json({
      status: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    (console.log("error creating category", error),
      res.status(500).json({ message: "Internal server error" }));
  }
}

export async function getCategories(req: AuthRequest, res: Response) {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.status(200).json({
      status: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.error("getCategories error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
