const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());
const dbConfig = require("./config/dbConfig");

const users_Route = require("./routes/usersRoute");
const exams_Route = require("./routes/examsRoute");
const reports_Route = require("./routes/reportsRoute");

// Kullanıcı rotasını ekle
app.use("/api/users", users_Route);

// Sınav rotasını ekle
app.use("/api/exams", exams_Route);

// Rapor rotasını ekle
app.use("/api/reports", reports_Route);

const port = process.env.PORT || 5000;

const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  // İstemci tarafındaki oluşturulan dosyaların bulunduğu klasöre istemci tarafını yönlendir
  app.use(express.static(path.join(__dirname, "client" , "build")));
  // Tüm istekleri istemci tarafına yönlendir
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });   
} 

// Belirtilen porttan sunucuyu dinle
app.listen(port, () => {
  console.log(`Server port_${port}'den dinleniyor.`);
});
