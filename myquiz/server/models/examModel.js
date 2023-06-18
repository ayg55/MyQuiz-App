const mongoose = require("mongoose");

// Sınav şeması tanımlanır
const exam_Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    passingMarks: {
      type: Number,
      required: true,
    },
    questions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "questions",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// 'exams' koleksiyonuna karşılık gelen model tanımlanır
const Exams = mongoose.model("exams", exam_Schema);

// Exams modeli dışa aktarılır
module.exports = Exams;
