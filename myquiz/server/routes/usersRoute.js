const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

// kullanıcı kaydı

router.post("/kayit", async (req, res) => {
  try {
    // kullanıcının var olup olmadığını kontrol et.
    const user_Exists = await User.findOne({ email: req.body.email });
    if (user_Exists) {
      return res
        .status(200)
        .send({ message: "Kullanıcı zaten mevcut", success: false });
    }

    // şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashed_Password = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashed_Password;

    // yeni kullanıcı oluştur
    const new_User = new User(req.body);
    await new_User.save();
    res.send({
      message: "Kullanıcı Oluşturma İşlemi Başarılı",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// kullanıcı girisi

router.post("/giris", async (req, res) => {
  try {
    // kullanıcının var olup olmadığını kontrol et
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "Kullanıcı mevcut değil", success: false });
    }

    // şifrenin doğruluğunu kontrol et.
    const valid_Password = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!valid_Password) {
      return res
        .status(200)
        .send({ message: "Geçersiz şifre", success: false });
    }
    // Kullanıcıya ait bir JWT oluştur ve dön
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // Başarılı yanıt gönder
    res.send({
      message: "Kullanıcı Giriş İşlemi Başarılı",
      success: true,
      data: token,
    });
  } catch (error) {
    // Hata durumunda istemciye hata mesajı gönder
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// kullanıcı bilgilerini getir.

router.post("/get-user-info", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.send({
      message: "Kullanıcı Bilgisi Başarıyla Alındı",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

module.exports = router;
