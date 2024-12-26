import mongoose, { Document, Schema } from "mongoose";

interface IProject extends Document {
  name: string;
  description: string;
  userId: string;
  config?: object;
}

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  config: { type: Object },
});

const Project = mongoose.model<IProject>("Project", ProjectSchema);
export default Project;
