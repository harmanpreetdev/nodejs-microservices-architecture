import mongoose, { Document, Schema } from "mongoose";

interface IPage extends Document {
  name: string;
  route: string;
  title: string;
  description?: string;
  metaTags?: string[]; // Array of meta tags for SEO
  isActive: boolean; // Flag for soft-deletion
}

const PageSchema = new Schema<IPage>(
  {
    name: {
      type: String,
      required: [true, "Page name is required"],
      unique: true,
      trim: true,
      minlength: [3, "Page name must be at least 3 characters long"],
      maxlength: [50, "Page name cannot exceed 50 characters"],
    },
    route: {
      type: String,
      required: [true, "Route is required"],
      unique: true,
      match: [
        /^\/[a-zA-Z0-9-_\/]*$/,
        "Route must be a valid URL path starting with '/'",
      ],
    },
    title: {
      type: String,
      required: [true, "Page title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
    },
    metaTags: {
      type: [String],
      validate: {
        validator: (tags: string[]) => tags.length <= 10,
        message: "You can add up to 10 meta tags only.",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to enforce rules or transformations
PageSchema.pre("save", function (next) {
  this.name = this.name.trim();
  this.title = this.title.trim();
  if (this.description) {
    this.description = this.description.trim();
  }
  next();
});

// Static method for finding active pages
PageSchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

// Instance method to soft-delete a page
PageSchema.methods.softDelete = function () {
  this.isActive = false;
  return this.save();
};

// Instance method to reactivate a page
PageSchema.methods.reactivate = function () {
  this.isActive = true;
  return this.save();
};

const Page = mongoose.model<IPage>("Page", PageSchema);
export default Page;
