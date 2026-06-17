import { Schema, model, Document } from "mongoose";

export interface ILink extends Document {
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
}

const linkSchema = new Schema<ILink>({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<ILink>("Link", linkSchema);
