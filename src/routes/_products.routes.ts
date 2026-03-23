import { Router } from "express";
import { requireAuth } from "../middleware/_auth";
import { requireAdmin } from "../middleware/_admin";
import { createProduct, getProducts } from "../controllers/_productcontroller";
import { upload } from "../utils/uploader";

const router = Router();

/**
 * @openapi
 * /api/products/create:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, description, price, category, stock]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               discountPrice:
 *                 type: number
 *               category:
 *                 type: string
 *                 description: Category ID
 *               stock:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Missing required fields or invalid category ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied, admins only
 *       500:
 *         description: Internal server error
 */
router.post(
  "/create",
  requireAuth,
  requireAdmin,
  upload.array("images", 5),
  createProduct,
);

/**
 * @openapi
 * /api/products/get:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of products per page (default 10)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Filter by minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Filter by maximum price
 *     responses:
 *       200:
 *         description: List of all products with pagination
 *       500:
 *         description: Internal server error
 */
router.get("/get", getProducts);
export default router;
