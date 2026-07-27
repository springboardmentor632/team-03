const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemeSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    department: { type: String, required: true },
    state: { type: String, default: "Global" },
    status: {
      type: String,
      enum: ["draft", "pending_approval", "approved", "archived"],
      default: "draft",
    },
    eligibilityRules: {
      ageMin: { type: Number, default: 0 },
      ageMax: { type: Number, default: 120 },
      gender: { type: String, enum: ["Male", "Female", "Transgender", "All"], default: "All" },
      incomeMax: { type: Number, default: null }, // Null means no upper income limit
      occupation: { type: String, default: "All" }, // "All" or a specific occupation
      education: { type: String, default: "All" }, // "All" or a specific education level
      state: { type: String, default: "All" }, // "All" or specific state
      category: { type: String, default: "All" }, // "All", "General", "OBC", "SC", "ST"
      disabilityRequired: { type: Boolean, default: false },
    },
    benefits: { type: String, default: "" },
    applicationProcess: { type: String, default: "" },
    updates: [
      {
        content: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    versionHistory: [{ version: Number, changedAt: Date, changedBy: { type: Schema.Types.ObjectId, ref: "User" }, summary: String }],
    approvedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true,
  }
);

schemeSchema.index({ category: 1 });
schemeSchema.index({ department: 1 });
schemeSchema.index({ state: 1 });
schemeSchema.index({ status: 1 });
schemeSchema.index({ createdAt: -1 });
schemeSchema.index({ title: "text", description: "text", benefits: "text" });


module.exports = mongoose.models.Schemes || mongoose.model("Schemes", schemeSchema);
