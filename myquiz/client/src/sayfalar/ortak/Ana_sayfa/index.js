import { Col, message, Row } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../../api_cagrilari/sinavlar";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Baslik from "../../../components/Baslik";
import { useNavigate } from "react-router-dom";
function Ana_sayfa() {
  const [exams, setExams] = React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getExams();
  }, []);

  return (
    user && (
      <div>
        
        <div className="divider"></div>
        <Row gutter={[16, 16]}>
          {exams.map((exam) => (
            <Col span={6}>
              <div className="card-lg flex flex-col gap-1 p-2">
                <h1 className="text-2xl">{exam?.name}</h1>

                <h1 className="text-md">Kategori : {exam.category}</h1>

                <h1 className="text-md">Toplam Not : {exam.totalMarks}</h1>
                <h1 className="text-md">Geçme Notu : {exam.passingMarks}</h1>
                <h1 className="text-md">Süre : {exam.duration} sn.</h1>

                <button
                  className="dark-outlined-btn"
                  onClick={() => navigate(`/ogrenci/write-exam/${exam._id}`)}
                >
                  Sınavı Başlat
                </button>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    )
  );
}

export default Ana_sayfa;
