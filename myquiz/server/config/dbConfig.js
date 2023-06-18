const mongoose = require("mongoose");

// Mongoose ile MongoDB'ye bağlantı sağlanır
mongoose.connect(process.env.MONGO_URL);

// Bağlantı üzerindeki olay dinleyicileri tanımlanır
const connection = mongoose.connection;

// Bağlantı başarılı olduğunda "connected" olayı tetiklenir
connection.on("connected", () => {
  console.log("Mongo Db Bağlantısı Başarılı.");
  console.log("Çalışıyor...");
});

// Bağlantı hatası olduğunda "error" olayı tetiklenir
connection.on("error", (err) => {
  console.log("Mongo Db Bağlantısı Başarısız");
});
module.exports = connection;
