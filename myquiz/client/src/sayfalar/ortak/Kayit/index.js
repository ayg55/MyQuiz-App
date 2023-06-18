import { Form, message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../api_cagrilari/kullanicilar";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Kayit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await registerUser(values);

      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        navigate("/giris");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-dark">
      <div className="card w-400 p-3 bg-white">
        <div className="flex flex-col">
          <h1 className="text-2xl">
            Kayıt Ol<i class="ri-user-add-line"></i>
          </h1>
          <div className="divider"></div>
          <Form layout="vertical" className="mt-2" onFinish={onFinish}>
            <Form.Item name="name" label="İsim">
              <input type="text" />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <input type="text" />
            </Form.Item>
            <Form.Item name="password" label="Şifre">
              <input type="password" />
            </Form.Item>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="dark-contained-btn mt-2 w-100"
              >
                Kayıt Ol
              </button>
              <Link to="/giris">Üye iseniz giriş yapmak için tıklayınız...</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Kayit;
