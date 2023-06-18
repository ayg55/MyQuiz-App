const router = require("express").Router();
const Exam = require("../models/examModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Question = require("../models/questionModel");


// sınav ekleme

router.post("/add", authMiddleware, async (req, res) => {
  try {
    // sınavın var olup olmadığının kontrolü
    const exam_Exists = await Exam.findOne({ name: req.body.name });
    if (exam_Exists) {
      // Eğer sınav zaten varsa istemciye bilgilendirme mesajı gönderilir
      return res
        .status(200)
        .send({ message: "Sınav Zaten Mevcut", success: false });
    }

    // Sınav soruları için boş bir dizi oluşturulur
    req.body.questions = [];

    // Yeni bir Exam nesnesi oluşturulur ve veritabanına kaydedilir
    const new_Exam = new Exam(req.body);
    await new_Exam.save();

    // Başarılı bir şekilde sınav eklenmiş mesajı istemciye gönderilir
    res.send({
      message: "Sınav Başarıyla Eklendi",
      success: true,
    });
  } catch (error) {
    // Hata durumunda istemciye hata mesajı gönderilir
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// var olan tüm sınavları al
router.post("/get-all-exams", authMiddleware, async (req, res) => {
  try {
    // Tüm sınavları veritabanından al
    const exams = await Exam.find({});

    // Alınan sınavları istemciye gönder
    res.send({
      message: "Sınavlar Başarılı Şekilde Alındı",
      data: exams,
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

// var olan sınavları id'ye göre al
router.post("/get-exam-by-id", authMiddleware, async (req, res) => {
  try {
    // İstenen sınavı ID'ye göre veritabanından al ve ilişkili soruları doldur
    const exam = await Exam.findById(req.body.examId).populate("questions");

    // Alınan sınavı istemciye gönder
    res.send({
      message: "Sınav Başarılı Şekilde Alındı",
      data: exam,
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

// sınavları id'ye göre düzenle
router.post("/edit-exam-by-id", authMiddleware, async (req, res) => {
  try {
    // İstenen sınavı ID'ye göre güncelle
    await Exam.findByIdAndUpdate(req.body.examId, req.body);
    // Başarılı yanıt gönder
    res.send({
      message: "Sınav Düzenleme İşlemi Başarılı",
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

// sınavları id'ye göre sil
router.post("/delete-exam-by-id", authMiddleware, async (req, res) => {
  try {
    // İstenen sınavı ID'ye göre sil
    await Exam.findByIdAndDelete(req.body.examId);
    // Başarılı yanıt gönder
    res.send({
      message: "Sınav Silme İşlemi Başarılı",
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

// sınava soru ekle

router.post("/add-question-to-exam", authMiddleware, async (req, res) => {
  try {
    // Yeni soruyu Questions koleksiyonuna ekle
    const new_Question = new Question(req.body);
    const question = await new_Question.save();

    // sınava soru ekleme kısmı
    const exam = await Exam.findById(req.body.exam);
    exam.questions.push(question._id);
    await exam.save();
    res.send({
      message: "Soru Ekleme İşlemi Başarılı",
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

// sınav sorularını düzenleme
router.post("/edit-question-in-exam", authMiddleware, async (req, res) => {
  try {
    // sorular arasından soruları düzenleme kısmı
    await Question.findByIdAndUpdate(req.body.questionId, req.body);
    res.send({
      message: "Soru Düzenleme İşlemi Başarılı",
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


// sınav sorularını silme
router.post("/delete-question-in-exam", authMiddleware, async (req, res) => {
     try {
        // sınav soruları arasından soruları silme kısmı
        await Question.findByIdAndDelete(req.body.questionId);

        
        const exam = await Exam.findById(req.body.examId);
        exam.questions = exam.questions.filter(
          (question) => question._id != req.body.questionId
        );
        await exam.save();
        res.send({
          message: "Soru Silme İşlemi Başarılı",
          success: true,
        });
     } catch (error) {
      
     }
});


module.exports = router;
