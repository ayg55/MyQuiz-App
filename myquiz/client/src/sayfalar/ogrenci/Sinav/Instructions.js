import React from "react";
import { useNavigate } from "react-router-dom";

function Instructions({ examData, setView, startTimer }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center gap-5">
      <ul className="flex flex-col gap-1">
        <h1 className="text-2xl underline">Talimatlar</h1>
        <li>Sınav {examData.duration} sn. içinde tamamlanmalıdır.</li>
        <li>
          Sınav {examData.duration}{" "}
          sn. sonra otomatik olarak sonlandırılacaktır.
        </li>
        <li>Kaydedilen cevap bir daha değiştirilemeyecektir.</li>
        <li>
          Sınavdaki toplam not : {" "}
          <span className="font-bold">{examData.totalMarks}</span>
        </li>
        <li>
          Sınavı Geçme Notu : {" "}
          <span className="font-bold">{examData.passingMarks}</span>
        </li>
      </ul>

      <div className="flex gap-2">
        <button className="dark-outlined-btn"
         onClick={()=>navigate('/')}
        >
              Çık
        </button>
        <button
          className="dark-contained-btn"
          onClick={() => {
            startTimer();
            setView("questions");
          }}
        >
          Sınavı Başlat
        </button>
      </div>
    </div>
  );
}

export default Instructions;
