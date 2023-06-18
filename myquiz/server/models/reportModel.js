const mongoose = require("mongoose");

// Rapor şeması tanımlanır
const report_Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "exams",
    },
    result: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// 'reports' koleksiyonuna karşılık gelen model tanımlanır
const Reports = mongoose.model("reports", report_Schema);

// Reports modeli dışa aktarılır
module.exports = Reports;
