import { Button } from "antd";
import "./css_part/themes.css";
import "./css_part/align.css";
import "./css_part/texts.css";
import "./css_part/components.css";
import "./css_part/forms.css";
import "./css_part/layout.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Giris from "./sayfalar/ortak/Giris";
import Kayit from "./sayfalar/ortak/Kayit";
import Yonlendirici from "./components/Yonlendirici";
import Ana_sayfa from "./sayfalar/ortak/Ana_sayfa";
import Sinav_hazirlama from "./sayfalar/ogretmen/Sinav_hazirlama";
import Sinav_olustur from "./sayfalar/ogretmen/Sinav_hazirlama/Sinav_olustur";
import Yukleyici from "./components/Yukleyici";
import { useSelector } from "react-redux";
import Sinav from "./sayfalar/ogrenci/Sinav";
import OgrenciSinavSonuc from "./sayfalar/ogrenci/OgrenciSinavSonuc";
import OgretmenSinavSonuc from "./sayfalar/ogretmen/OgretmenSinavSonuc";

function App() {
  const { loading } = useSelector((state) => state.loader);
  return (
    <>
      {loading && <Yukleyici />}
      <BrowserRouter>
        <Routes>
          {/* Ortak sayfa yönlendirme */}
          <Route path="/giris" element={<Giris />} />
          <Route path="/kayit" element={<Kayit />} />

          {/* Öğrenci yönlendirmesi*/}
          <Route
            path="/"
            element={
              <Yonlendirici>
                <Ana_sayfa />
              </Yonlendirici>
            }
          />
          <Route
            path="/ogrenci/write-exam/:id"
            element={
              <Yonlendirici>
                <Sinav/>
              </Yonlendirici>
            }
          />
          <Route
            path="/ogrenci/reports"
            element={
              <Yonlendirici>
                <OgrenciSinavSonuc/>
              </Yonlendirici>
            }
          />
          {/* Öğretmen yönlendirmesi */}
          <Route
            path="/ogretmen/sinav_hazirlama"
            element={
              <Yonlendirici>
                <Sinav_hazirlama />
              </Yonlendirici>
            }
          />
          <Route
            path="/ogretmen/sinav_hazirlama/add"
            element={
              <Yonlendirici>
                <Sinav_olustur />
              </Yonlendirici>
            }
          />

          <Route
            path="/ogretmen/sinav_hazirlama/edit/:id"
            element={
              <Yonlendirici>
                <Sinav_olustur />
              </Yonlendirici>
            }
          />

          <Route
            path="/ogretmen/reports"
            element={
              <Yonlendirici>
                <OgretmenSinavSonuc />
              </Yonlendirici>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
