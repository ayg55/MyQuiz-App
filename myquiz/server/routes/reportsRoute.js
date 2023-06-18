const authMiddleware = require("../middlewares/authMiddleware");
const Exam = require("../models/examModel");
const User = require("../models/userModel");
const Report = require("../models/reportModel");
const router = require("express").Router();

// sınav sonuçlarını göstermek için iste

router.post("/add-report", authMiddleware, async (req, res) => {
  try {
    // Yeni raporu Report koleksiyonuna ekle
    const new_Report = new Report(req.body);
    await new_Report.save();
    // Başarılı yanıt gönder
    res.send({
      message: "Attempt added successfully",
      success: true,
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

// tüm sınav sonuçlarını getir

router.post("/get-all-reports", authMiddleware, async (req, res) => {
  try {
    // İstekten sınav adı ve kullanıcı adını al
    const { exam_Name, user_Name } = req.body;
    // Sınav adına göre eşleşen sınavları bul
    const exams = await Exam.find({
      name: {
        $regex: exam_Name,
      },
    });
    // Eşleşen sınavların ID'lerini al
    const matched_ExamIds = exams.map((exam) => exam._id);

    // Kullanıcı adına göre eşleşen kullanıcıları bul
    const users = await User.find({
      name: {
        $regex: user_Name,
      },
    });
    // Eşleşen kullanıcıların ID'lerini al
    const matchedUser_Ids = users.map((user) => user._id);
    // Eşleşen sınav ve kullanıcı ID'lerine göre raporları bul
    const reports = await Report.find({
      exam: {
        $in: matched_ExamIds,
      },
      user: {
        $in: matchedUser_Ids,
      },
    })
      .populate("exam")
      .populate("user")
      .sort({ createdAt: -1 });
      // Başarılı yanıt gönder
    res.send({
      message: "Denemeler başarıyla alındı.",
      data: reports,
      success: true,
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

// kullanıcıların sınav sonuçlarını alma
router.post("/get-all-reports-by-user", authMiddleware, async (req, res) => {
  try {
    // Kullanıcının ID'sine göre raporları bul
    const reports = await Report.find({ user: req.body.userId })
      .populate("exam")
      .populate("user")
      .sort({ createdAt: -1 });

      // Başarılı yanıt gönder
    res.send({
      message: "Denemeler başarıyla alındı.",
      data: reports,
      success: true,
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

module.exports = router;
