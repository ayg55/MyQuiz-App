import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById } from "../../../api_cagrilari/sinavlar";
import { addReport } from "../../../api_cagrilari/sonuclar";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Instructions from "./Instructions";

function Sinav() {
  const [examData, setExamData] = React.useState(null);
  const [questions = [], setQuestions] = React.useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState(0);
  const [selectedOptions, setSelectedOptions] = React.useState({});
  const [result = {}, setResult] = React.useState({});
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState("instructions");
  const [secondsLeft = 0, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const { user } = useSelector((state) => state.users);
  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setQuestions(response.data.questions);
        setExamData(response.data);
        setSecondsLeft(response.data.duration);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const calculateResult = async () => {
    try {
      let correctAnswers = [];
      let wrongAnswers = [];

      questions.forEach((question, index) => {
        if (question.correctOption === selectedOptions[index]) {
          correctAnswers.push(question);
        } else {
          wrongAnswers.push(question);
        }
      });

      let verdict = "Geçti";
      if (correctAnswers.length < examData.passingMarks) {
        verdict = "Kaldı";
      }

      const tempResult = {
        correctAnswers,
        wrongAnswers,
        verdict,
      };
      setResult(tempResult);
      dispatch(ShowLoading());
      const response = await addReport({
        exam: params.id,
        result: tempResult,
        user: user._id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setView("result");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const startTimer = () => {
    let totalSeconds = examData.duration;
    const intervalId = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds = totalSeconds - 1;
        setSecondsLeft(totalSeconds);
      } else {
        setTimeUp(true);
      }
    }, 1000);
    setIntervalId(intervalId);
  };

  useEffect(() => {
    if (timeUp && view === "questions") {
      clearInterval(intervalId);
      calculateResult();
    }
  }, [timeUp]);

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, []);
  return (
    examData && (
      <div className="mt-2">
        <div className="divider"></div>
        <h1 className="text-center">{examData.name}</h1>
        <div className="divider"></div>

        {view === "instructions" && (
          <Instructions
            examData={examData}
            setView={setView}
            startTimer={startTimer}
          />
        )}

        {view === "questions" && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h1 className="text-2xl">
                {selectedQuestionIndex + 1} :{" "}
                {questions[selectedQuestionIndex].name}
              </h1>

              <div className="timer">
                <span className="text-2xl">{secondsLeft}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {Object.keys(questions[selectedQuestionIndex].options).map(
                (option, index) => {
                  return (
                    <div
                      className={`flex gap-2 flex-col ${
                        selectedOptions[selectedQuestionIndex] === option
                          ? "selected-option"
                          : "option"
                      }`}
                      key={index}
                      onClick={() => {
                        setSelectedOptions({
                          ...selectedOptions,
                          [selectedQuestionIndex]: option,
                        });
                      }}
                    >
                      <h1 className="text-xl">
                        {option} :{" "}
                        {questions[selectedQuestionIndex].options[option]}
                      </h1>
                    </div>
                  );
                }
              )}
            </div>

            <div className="flex justify-between">
              {selectedQuestionIndex > 0 && (
                <button
                  className="dark-outlined-btn"
                  onClick={() => {
                    setSelectedQuestionIndex(selectedQuestionIndex - 1);
                  }}
                >
                  Önceki
                </button>
              )}

              {selectedQuestionIndex < questions.length - 1 && (
                <button
                  className="dark-contained-btn"
                  onClick={() => {
                    setSelectedQuestionIndex(selectedQuestionIndex + 1);
                  }}
                >
                  Sonraki
                </button>
              )}

              {selectedQuestionIndex === questions.length - 1 && (
                <button
                  className="dark-contained-btn"
                  onClick={() => {
                    clearInterval(intervalId);
                    setTimeUp(true);
                  }}
                >
                  Sınavı Bitir
                </button>
              )}
            </div>
          </div>
        )}

        {view === "result" && (
          <div className="flex  items-center mt-2 justify-center result">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl">Sonuç</h1>
               <div className="divider"></div>
              <div className="marks">
                <h1 className="text-md">Toplam Not : {examData.totalMarks}</h1>
                <h1 className="text-md">
                  Notunuz :{result.correctAnswers.length}
                </h1>
                <h1 className="text-md">
                  Yanlış Soru Sayısı : {result.wrongAnswers.length}
                </h1>
                <h1 className="text-md">
                  Geçme Notu : {examData.passingMarks}
                </h1>
                <h1 className="text-md">Durum :{result.verdict}</h1>

                <div className="flex gap-2 mt-2">
                  <button
                    className="dark-outlined-btn"
                    onClick={() => {
                      setView("instructions");
                      setSelectedQuestionIndex(0);
                      setSelectedOptions({});
                      setSecondsLeft(examData.duration);
                    }}
                  >
                    Yeniden Dene
                  </button>
                  <button
                    className="dark-contained-btn"
                    onClick={() => {
                      setView("review");
                    }}
                  >
                    Sonuçları Göster
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "review" && (
          <div className="flex flex-col gap-2">
            {questions.map((question, index) => {
              const isCorrect =
                question.correctOption === selectedOptions[index];
              return (
                <div
                  className={`
                  flex flex-col gap-1 p-2 ${
                    isCorrect ? "bg-success" : "bg-error"
                  }
                `}
                >
                  <h1 className="text-xl">
                    {index + 1} : {question.name}
                  </h1>
                  <h1 className="text-md">
                    Seçilen Cevap : {selectedOptions[index]} -{" "}
                    {question.options[selectedOptions[index]]}
                  </h1>
                  <h1 className="text-md">
                    Doğru Cevap : {question.correctOption} -{" "}
                    {question.options[question.correctOption]}
                  </h1>
                </div>
              );
            })}

            <div className="flex justify-center gap-2">
              <button
                className="dark-outlined-btn"
                onClick={() => {
                  navigate("/");
                }}
              >
                Çık
              </button>
              <button
                className="dark-contained-btn"
                onClick={() => {
                  setView("instructions");
                  setSelectedQuestionIndex(0);
                  setSelectedOptions({});
                  setSecondsLeft(examData.duration);
                }}
              >
                Yeniden Dene
              </button>
            </div>
          </div>
        )}
      </div> 
    )
  );
}

export default Sinav;
