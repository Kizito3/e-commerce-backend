import mongoose, { Document, Schema, Model } from "mongoose";
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: mongoose.Types.ObjectId;
  images?: string[];
  stock?: number;
  sold?: number;
  ratings?: number;
  numReviews?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: { type: [String], default: [] },
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  ProductSchema,
);

export default Product;
