import { Form, message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser } from "../../../api_cagrilari/kullanicilar";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Giris() {
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await loginUser(values);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
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
          <div className="flex">
            <h1 className="text-2xl">Giriş Yap<i class="ri-login-circle-line"></i></h1>
            
          </div>
          <div className="divider"></div>
          <Form layout="vertical" className="mt-2" onFinish={onFinish}>
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
                Giriş Yap
              </button>
              <Link to="/kayit" className="underline">
                Üye değilseniz tıklayınız...
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Giris;
