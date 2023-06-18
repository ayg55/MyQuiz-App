const jwt = require("jsonwebtoken");

// Kimlik doğrulama ara yazılımı (middleware)
module.exports = (req, res, next) => {
  try {
    // İstek başlığından token alınır
    const token = req.headers.authorization.split(" ")[1];

    // Token doğrulanır ve çözümlenir
    const decoded_Token = jwt.verify(token, process.env.JWT_SECRET);

    // Çözümlenen token'dan kullanıcı kimliği alınır
    const user_Id = decoded_Token.userId;

    // İstek nesnesine kullanıcı kimliği atanır
    req.body.userId = user_Id;

    // Sonraki işleme geçilmesi için next() fonksiyonu çağrılır
    next();
  } catch (error) {

    // Hata durumunda istemciye hata mesajı gönderilir
    res.status(401).send({
      message: "Yetkiniz yok.",
      data: error,
      success: false,
    });
  }
};
