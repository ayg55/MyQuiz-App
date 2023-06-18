import { message } from "antd";
import React, { useEffect, useState } from "react";
import { getUserInfo } from "../api_cagrilari/kullanicilar";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice.js";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";

function Yonlendirici({ children }) {
  const { user } = useSelector((state) => state.users);
  const [menu, setMenu] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // öğrenci kullanıcı menüsü öğeleri
  const userMenu = [
    {
      title: "Ana Sayfa",
      paths: ["/", "/ogrenci/write-exam"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "Sonuçlar",
      paths: ["/ogrenci/reports"],
      icon: <i class="ri-bar-chart-box-line"></i>,
      onClick: () => navigate("/ogrenci/reports"),
    },
    {
      title: "Profil",
      paths: ["/profile_"],
      icon: <i class="ri-profile-line"></i>,
      onClick: () => navigate("/profile_"),
    },
    {
      title: "Çıkış",
      paths: ["/logout"],
      icon: <i class="ri-door-open-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/giris");
      },
    },
  ];

  // öğretmen kullanıcı menüsü öğeleri
  const adminMenu = [
    {
      title: "Ana Sayfa",
      paths: ["/", "/ogrenci/write-exam"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "Sınav",
      paths: ["/ogretmen/sinav_hazirlama", "/ogretmen/sinav_hazirlama/add"],
      icon: <i class="ri-file-add-line"></i>,
      onClick: () => navigate("/ogretmen/sinav_hazirlama"),
    },
    {
      title: "Sonuçlar",
      paths: ["/ogretmen/reports"],
      icon: <i class="ri-bar-chart-box-line"></i>,
      onClick: () => navigate("/ogretmen/reports"),
    },
    {
      title: "Profil",
      paths: ["/profile_"],
      icon: <i class="ri-profile-line"></i>,
      onClick: () => navigate("/profile_"),
    },
    {
      title: "Çıkış",
      paths: ["/logout"],
      icon: <i class="ri-door-open-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/giris");
      },
    },
  ];

  // Kullanıcı bilgilerini alır ve menüyü günceller
  const getUserData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserInfo();
      dispatch(HideLoading());
      if (response.success) {
        dispatch(SetUser(response.data));
        if (response.data.isAdmin) {
          // Öğretmen kullanıcıysa öğretmen menüsünü ayarla
          setMenu(adminMenu);
        } else {
          // Öğrenci kullanıcıysa öğrenci menüsünü ayarla
          setMenu(userMenu);
        }
      } else {
        message.error(response.message);
      }
    } catch (error) {
      navigate("/giris");
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

      // Kullanıcı oturumu kontrolü
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData();
    } else {
      navigate("/giris");
    }
    // eslint-disable-next-line
  }, []);

  const activeRoute = window.location.pathname;

  const getIsActiveOrNot = (paths) => {
    if (paths.includes(activeRoute)) {
      return true;
    } else {
      if (
        activeRoute.includes("/ogretmen/sinav_hazirlama/edit") &&
        paths.includes("/ogretmen/sinav_hazirlama")
      ) {
        return true;
      }
      if (
        activeRoute.includes("/ogrenci/write-exam") &&
        paths.includes("/ogrenci/write-exam")
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="layout">
      <div className="flex gap-2 w-full h-full h-100">
        <div className="sidebar">
          <div className="menu">
            {menu.map((item, index) => {
              return (
                <div
                  className={`menu-item ${
                    getIsActiveOrNot(item.paths) && "active-menu-item"
                  }`}
                  key={index}
                  onClick={item.onClick}
                >
                  {item.icon}
                  {!collapsed && <span>{item.title}</span>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="body">
          <div className="header flex justify-between">
            {!collapsed && (
              <i
                className="ri-close-line"
                onClick={() => setCollapsed(true)}
              ></i>
            )}
            {collapsed && (
              <i
                className="ri-menu-line"
                onClick={() => setCollapsed(false)}
              ></i>
            )}
            <h1 className="text-2xl text-white">My Quiz</h1>
            <div>
              <div className="flex gap-1 items-center">
                <h1 className="text-md text-white">{user?.name}</h1>
              </div>
              <span>Oturum : {user?.isAdmin ? "Öğretmen" : "Öğrenci"}</span>
            </div>
          </div>
          <div className="content">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Yonlendirici;
