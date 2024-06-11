import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Select, Input, Button, Modal, Row, Col, Space } from "antd";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const FormEditLembur = () => {
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const [lemburData, setLemburData] = useState({
    tanggal: "",
    jamMulai: "",
    jamSelesai: "",
    jenisHari: "",
    pekerjaanLebih: "",
  });

  useEffect(() => {
    const getLemburById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/lemburs/approval/${id}`
        );
        const lembur = response.data;
        setLemburData({
          tanggal: lembur.tanggal
            ? moment(lembur.tanggal).format("YYYY-MM-DD")
            : "",
          jamMulai: lembur.jamMulai
            ? moment(lembur.jamMulai, "HH:mm").format("HH:mm")
            : "",
          jamSelesai: lembur.jamSelesai
            ? moment(lembur.jamSelesai, "HH:mm").format("HH:mm")
            : "",
          jenisHari: lembur.jenisHari,
          pekerjaanLebih: lembur.pekerjaanLebih,
        });
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getLemburById();
  }, [id]);

  const handleInputChange = (event) => {
    setLemburData({
      ...lemburData,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/lemburs/approval/${id}`,
        lemburData
      );
      setIsModalVisible(false);
      navigate("/approval/approvallembur");
      message.success("Lembur berhasil diupdate");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  const showConfirmModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <h1
        style={{
          fontSize: "24px",
          marginBottom: "20px",
          color: "black",
          fontWeight: "bold",
        }}
      >
        Edit Lembur
      </h1>

      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <Row gutter={16}>
              <Col span={12}>
                <Space style={{ marginBottom: "10px", display: "block" }}>
                  <label className="text_label">Tanggal</label>
                  <div style={{ paddingLeft: "30px" }}>
                    <Input
                      style={{ width: "100%" }}
                      name="tanggal"
                      value={lemburData.tanggal}
                      onChange={handleInputChange}
                    />
                  </div>
                </Space>
                <Space style={{ marginBottom: "10px", display: "block" }}>
                  <label className="text_label">Jenis Hari</label>
                  <div style={{ paddingLeft: "30px" }}>
                    <Select
                      name="jenisHari"
                      value={lemburData.jenisHari}
                      onChange={(value) =>
                        handleInputChange({
                          target: { name: "jenisHari", value },
                        })
                      }
                      style={{ width: "100%" }}
                    >
                      <Option value="Hari Kerja">Hari Kerja</Option>
                      <Option value="Hari Libur Bersama">
                        Hari Libur Bersama
                      </Option>
                      <Option value="Hari Libur Nasional">
                        Hari Libur Nasional
                      </Option>
                    </Select>
                  </div>
                </Space>
                <Space style={{ marginBottom: "10px", display: "block" }}>
                  <label className="text_label">Pekerjaan Lebih</label>
                  <div style={{ paddingLeft: "30px" }}>
                    <Input
                      name="pekerjaanLebih"
                      value={lemburData.pekerjaanLebih}
                      onChange={handleInputChange}
                    />
                  </div>
                </Space>
                <div style={{ paddingLeft: "30px" }}>
                  <Button type="primary" onClick={showConfirmModal}>
                    Update
                  </Button>
                </div>
              </Col>
              <Col span={12}>
                <Space style={{ marginBottom: "10px", display: "block" }}>
                  <label className="text_label">Jam Mulai</label>
                  <div style={{ paddingLeft: "30px" }}>
                    <Input
                      style={{ width: "100%" }}
                      name="jamMulai"
                      value={lemburData.jamMulai}
                      onChange={handleInputChange}
                    />
                  </div>
                </Space>
                <Space style={{ marginBottom: "10px", display: "block" }}>
                  <label className="text_label">Jam Selesai</label>
                  <div style={{ paddingLeft: "30px" }}>
                    <Input
                      style={{ width: "100%" }}
                      name="jamSelesai"
                      value={lemburData.jamSelesai}
                      onChange={handleInputChange}
                    />
                  </div>
                </Space>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <Modal
        title="Konfirmasi"
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={handleCancel}
        okText="Update"
        cancelText="Batal"
      >
        <p>Apakah Anda yakin ingin mengupdate lembur?</p>
      </Modal>
    </div>
  );
};

export default FormEditLembur;
