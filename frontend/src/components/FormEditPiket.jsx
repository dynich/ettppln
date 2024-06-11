import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Select, Input, Button, Modal, Row, Col, Space } from "antd";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const FormEditPiket = () => {
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const [piketData, setPiketData] = useState({
    tanggal: "",
    jamMulai: "",
    jamSelesai: "",
    jenisPiket: "",
    jenisHari: "",
    pekerjaanLebih: "",
  });

  useEffect(() => {
    const getPiketById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/pikets/approval/${id}`
        );
        const piket = response.data;
        setPiketData({
          tanggal: piket.tanggal
            ? moment(piket.tanggal).format("YYYY-MM-DD")
            : "",
          jamMulai: piket.jamMulai
            ? moment(piket.jamMulai, "HH:mm").format("HH:mm")
            : "",
          jamSelesai: piket.jamSelesai
            ? moment(piket.jamSelesai, "HH:mm").format("HH:mm")
            : "",
          jenisPiket: piket.jenisPiket,
          jenisHari: piket.jenisHari,
          pekerjaanLebih: piket.pekerjaanLebih,
        });
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getPiketById();
  }, [id]);

  const handleInputChange = (event) => {
    setPiketData({
      ...piketData,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/pikets/approval/${id}`,
        piketData
      );
      setIsModalVisible(false);
      navigate("/approval/approvalpiket");
      message.success("Piket berhasil diupdate");
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
        Edit Piket
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
                      value={piketData.tanggal}
                      onChange={handleInputChange}
                    />
                  </div>
                </Space>
                <Space style={{ marginBottom: "10px", display: "block" }}>
                  <label className="text_label">Jenis Piket</label>
                  <div style={{ paddingLeft: "30px" }}>
                    <Select
                      name="jenisPiket"
                      value={piketData.jenisPiket}
                      onChange={(value) =>
                        handleInputChange({
                          target: { name: "jenisPiket", value },
                        })
                      }
                      style={{ width: "100%" }}
                    >
                      <Option value="Piket Khusus">Piket Khusus</Option>
                      <Option value="Piket Rutin">Piket Rutin</Option>
                    </Select>
                  </div>
                </Space>
                <Space style={{ marginBottom: "10px", display: "block" }}>
                  <label className="text_label">Pekerjaan Lebih</label>
                  <div style={{ paddingLeft: "30px" }}>
                    <Input
                      name="pekerjaanLebih"
                      value={piketData.pekerjaanLebih}
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
                      value={piketData.jamMulai}
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
                      value={piketData.jamSelesai}
                      onChange={handleInputChange}
                    />
                  </div>
                </Space>
                <Space style={{ marginBottom: "10px", display: "block" }}>
                  <label className="text_label">Jenis Hari</label>
                  <div style={{ paddingLeft: "30px" }}>
                    <Select
                      name="jenisHari"
                      value={piketData.jenisHari}
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
        <p>Apakah Anda yakin ingin mengupdate piket?</p>
      </Modal>
    </div>
  );
};

export default FormEditPiket;
