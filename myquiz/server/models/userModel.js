const mongoose = require("mongoose");

// Kullanıcı şeması tanımlanır
const user_Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// 'users' koleksiyonuna karşılık gelen model tanımlanır
const user_Model = mongoose.model("users", user_Schema);

// user_Model modeli dışa aktarılır
module.exports = user_Model;
