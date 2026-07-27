const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const policySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // Healthcare, Education, Agriculture, etc.
    department: { type: String, required: true }, // Finance, Health, Home Affairs, etc.
    state: { type: String, default: "Global" }, // "Global" or state name
    status: {
      type: String,
      enum: ["draft", "pending_approval", "approved", "archived"],
      default: "draft",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    versionHistory: [{ version: Number, changedAt: Date, changedBy: { type: Schema.Types.ObjectId, ref: "User" }, summary: String }],
    approvedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    benefits: { type: String, default: "" },
    applicationProcess: { type: String, default: "" },
    deadline: { type: Date, default: null },
    sourceUrl: { type: String, default: "" },
    officialReference: { type: String, default: "" },
    ministry: { type: String, default: "" },
    publicationDate: { type: Date, default: null },
    effectiveDate: { type: Date, default: null },
    language: { type: String, default: "en" },
    version: { type: Number, default: 1 },
    document: { key: { type: String, default: "" }, name: { type: String, default: "" }, mimeType: { type: String, default: "" } },
  },
  {
    timestamps: true,
  }
);

policySchema.index({ category: 1 });
policySchema.index({ department: 1 });
policySchema.index({ state: 1 });
policySchema.index({ status: 1 });
policySchema.index({ createdAt: -1 });
policySchema.index({ title: "text", description: "text", officialReference: "text" });


module.exports = mongoose.models.Policies || mongoose.model("Policies", policySchema);
