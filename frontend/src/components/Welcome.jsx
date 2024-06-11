import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card } from "antd";
import "./welcome.css";
import { useSelector } from 'react-redux'; // Importing useSelector from react-redux

const Welcome = () => {
  // Retrieve the user's role from the Redux store (adjust according to your store's structure)
  const user = useSelector((state) => state.auth.user);

  // Determine if the user is 'user' or 'admin1'


  return (
    <div className="welcome-container">
      <div className="welcome-content" style={{ padding: "0.25rem 1.25rem" }}>
        {/* Baris Pertama */}
        <Row gutter={16} className="mb-4">
          <Col span={24}>
            <Card className="bgwelcome">
              <h6 className="textdashboard">Halo! Selamat Datang di</h6>
              <h2 className="textdashboard2">E-TTP PLN IP UPDK TELLO</h2>
              <p className="textdashboard">
                E-TTP PLN IP UPDK TELLO adalah website khusus bagi para pegawai PLN UPDK
                Tello untuk membuat pelaporan terkait lembur, piket, serta premi
                dalam rangka digitalisasi proses administrasi yang memudahkan
                pegawai untuk melihat alur dan tracking dari laporannya.
              </p>
            </Card>
          </Col>
        </Row>

        {/* Baris Kedua - Only visible to users with 'user' or 'admin1' roles */}
        {user && (user.role === 'user' || user.role === 'admin1') && (
          <Row gutter={16}>
            {/* Lembur Section */}
            <Col span={8}>
              <Card className="menu-box">
                <div className="gradient-box" />
                <div style={{ padding: "20px" }}>
                  <h2 className="text-menu">LEMBUR</h2>
                  <div className="text-menu-desc">
                    <p className="text-menu-p">
                      Lembur adalah waktu kerja tambahan yang dilakukan di luar
                      jam kerja normal, lebih tepatnya melebihi 40 jam waktu kerja per
                      minggu.
                    </p>
                  </div>
                  <Link to="/dashboard/lemburs" className="menu-button">Buka</Link>
                </div>
              </Card>
            </Col>

            {/* Piket Section */}
            <Col span={8}>
              <Card className="menu-box">
                <div className="gradient-box" />
                <div style={{ padding: "20px" }}>
                  <h2 className="text-menu">PIKET</h2>
                  <div className="text-menu-desc">
                    <p className="text-menu-p">
                      Piket adalah tugas yang harus dilakukan oleh karyawan di luar
                      jam kerja normal, biasanya pada malam hari atau akhir pekan.
                    </p>
                  </div>
                  <Link to="/dashboard/pikets" className="menu-button">Buka</Link>
                </div>
              </Card>
            </Col>

            {/* Premi Section */}
            <Col span={8}>
              <Card className="menu-box">
                <div className="gradient-box" />
                <div style={{ padding: "20px" }}>
                  <h2 className="text-menu">PREMI</h2>
                  <div className="text-menu-desc">
                    <p className="text-menu-p">
                      Premi adalah imbalan yang diberikan kepada karyawan atas
                      kinerjanya yang melebihi standar.
                    </p>
                  </div>
                  <Link to="/dashboard/premis" className="menu-button">Buka</Link>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default Welcome;
