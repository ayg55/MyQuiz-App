const mongoose = require("mongoose");

// Soru şeması tanımlanır
const question_Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  correctOption: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    required: true,
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "exams",
  },
}, {
    timestamps: true,
});

// 'questions' koleksiyonuna karşılık gelen model tanımlanır
const Questions = mongoose.model("questions", question_Schema);

// Questions modeli dışa aktarılır
module.exports = Questions;
