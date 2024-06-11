import React, { useState, useEffect } from "react";
import { Input, Button } from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  ApartmentOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  ToolOutlined,
  BankOutlined,
} from "@ant-design/icons";
import Layout from "./Layout";
import axios from "axios";

import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdEditDocument } from "react-icons/md";

const DataPegawai = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    nip: "",
    grade: "",
    jabatan: "",
    bagian: "",
    unitKerja: "",
  });

  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await axios.get("http://localhost:5000/me");
        const user = response.data;
        setUserData({
          name: user.name,
          email: user.email,
          nip: user.nip,
          grade: user.grade,
          jabatan: user.jabatan,
          atasan: user.atasan,
          bagian: user.bagian,
          unitKerja: user.unitKerja,
        });
      } catch (error) {
        if (error.response) {
          console.log(error.response.data.msg);
        }
      }
    };
    getMe();
  }, [id]);

  const renderInput = (label, value, prefix) => (
    <div className="input-group" style={{ marginBottom: "16px" }}>
      <p>{label}</p>
      <Input value={value} prefix={prefix} style={{ width: "37vw" }} readOnly />
    </div>
  );

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              marginBottom: "20px",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Data Pegawai
          </h1>
          <Link to={`/datapegawai/edit/${user.uuid}`}>
            <Button
              type="primary"
              icon={<MdEditDocument />}
              style={{ marginBottom: 20 }}
            >
              Edit
            </Button>
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
          <div className="bg-white justify-content-between bginfopribadi">
            {/* <div className="bg-white justify-content-between bginfopribadi"> */}

            <h3
              className="informasi_pribadi"
              style={{ color: "#168FF0", marginTop: "10px" }}
            >
              Informasi Pribadi
            </h3>

            <div className="nama_lengkap">
              <div
                style={{ display: "flex", flexDirection: "row", gap: "16px" }}
              >
                {renderInput("Nama Lengkap", userData.name, <UserOutlined />)}
                {renderInput("Alamat Email", userData.email, <MailOutlined />)}
              </div>
            </div>
          </div>
        </div>
        <hr
          style={{
            margin: "20px 5px",
            border: "2px solid #D9D9D9",
            width: "80vw",
          }}
        />
        <div className="bg-white justify-content-between bgdatapegawai">
          <h3
            className="informasi_pribadi"
            style={{ color: "#168FF0", marginTop: "1px" }}
          >
            Data Pegawai
          </h3>

          <div className="nama_lengkap">
            <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
              {renderInput("NIP", userData.nip, <IdcardOutlined />)}
              {renderInput("Grade", userData.grade, <ApartmentOutlined />)}
            </div>

            <div
              className="input-group"
              style={{ display: "flex", flexDirection: "row", gap: "16px" }}
            >
              {renderInput("Jabatan", userData.jabatan, <TeamOutlined />)}
              {renderInput("Atasan", userData.atasan, <ToolOutlined />)}
            </div>
            {/* {renderInput("Jabatan", userData.jabatan, <TeamOutlined />)}
                            {renderInput("Atasan", userData.atasan, <ToolOutlined />)}
                        </div> */}
            <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
              <div className="input-group">
                {renderInput(
                  "Bagian",
                  userData.bagian,
                  <UsergroupAddOutlined />
                )}
              </div>
              {renderInput("Unit Kerja", userData.unitKerja, <BankOutlined />)}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DataPegawai;
