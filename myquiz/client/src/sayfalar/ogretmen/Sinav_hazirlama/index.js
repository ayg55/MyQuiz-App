import { message, Table } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteExamById, getAllExams } from "../../../api_cagrilari/sinavlar";
import Baslik from "../../../components/Baslik";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";


function Exams() {
  const navigate = useNavigate();
  const [exams, setExams] = React.useState([]);
  const dispatch = useDispatch();
  // Sınav verilerini alır
  const getExamsData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      dispatch(HideLoading());
      if (response.success) {
        // Sınav verilerini ayarlar
        setExams(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

    //sınav silme
  const deleteExam = async (examId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteExamById({
        examId,
      });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamsData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  const columns = [
    {
      title: "Sınav İsmi",
      dataIndex: "name",
    },
    {
      title: "Süre (sn.)",
      dataIndex: "duration",
    },
    {
      title: "Kategori",
      dataIndex: "category",
    },
    {
      title: "Toplam Puan",
      dataIndex: "totalMarks",
    },
    {
      title: "Geçme Notu",
      dataIndex: "passingMarks",
    },
    {
      title: "İşlem",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <i
            className="ri-pencil-line"
            onClick={() => navigate(`/ogretmen/sinav_hazirlama/edit/${record._id}`)}
          ></i>
          <i
            className="ri-delete-bin-line"
            onClick={() => deleteExam(record._id)}
          ></i>
        </div>
      ),
    },
  ];
  useEffect(() => {
    getExamsData();
  }, []);
  return (
    <div>
      <div className="flex justify-between mt-2 items-end">
        <Baslik title="Sınavlar" />

        <button
          className="dark-outlined-btn flex items-center"
          onClick={() => navigate("/ogretmen/sinav_hazirlama/add")}
        >
          <i className="ri-add-line"></i>
          Sınav Oluştur
        </button>
      </div>
      <div className="divider"></div>

      <Table columns={columns} dataSource={exams} />
    </div>
  );
}

export default Exams;
