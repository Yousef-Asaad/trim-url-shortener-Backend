import { Schema, model, Document, Types } from "mongoose";

export interface IClick extends Document {
  linkId: Types.ObjectId;
  timestamp: Date;
  referrer: string;
  userAgent: string;
}

const clickSchema = new Schema<IClick>({
  linkId: { type: Schema.Types.ObjectId, ref: "Link", required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  referrer: { type: String, default: "" },
  userAgent: { type: String, default: "" },
});

export default model<IClick>("Click", clickSchema);
