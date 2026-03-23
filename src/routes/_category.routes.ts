import { Router } from "express";
import { requireAuth } from "../middleware/_auth";
import { requireAdmin } from "../middleware/_admin";
import {
  createCategory,
  getCategories,
} from "../controllers/_categorycontroller";

const router = Router();

/**
 * @openapi
 * /api/categories/create:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Category name is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied, admins only
 *       409:
 *         description: Category already exists
 *       500:
 *         description: Internal server error
 */
router.post("/create", requireAuth, requireAdmin, createCategory);

/**
 * @openapi
 * /api/categories/get-all:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all categories
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/get-all", requireAuth, getCategories);

export default router;
