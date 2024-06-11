import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Select, Input, Button, Modal, Row, Col, Space } from "antd";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const FormEditPremi = () => {
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const [premiData, setPremiData] = useState({
    tanggal: "",
    jenisHari: "",
    jenisShift: "",
    pekerjaanLebih: "",
  });

  useEffect(() => {
    const getPremiById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/premis/approval/${id}`
        );
        const premi = response.data;
        setPremiData({
          tanggal: premi.tanggal
            ? moment(premi.tanggal).format("YYYY-MM-DD")
            : "",
          jenisHari: premi.jenisHari,
          jenisShift: premi.jenisShift,
          pekerjaanLebih: premi.pekerjaanLebih,
        });
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getPremiById();
  }, [id]);

  const handleInputChange = (event) => {
    setPremiData({
      ...premiData,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/premis/approval/${id}`,
        premiData
      );
      setIsModalVisible(false);
      navigate("/approval/approvalpremi");
      message.success("Premi berhasil diupdate");
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
        Edit Premi
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
                      value={premiData.tanggal}
                      onChange={handleInputChange}
                    />
                  </div>
                </Space>

                <Space style={{ marginBottom: "10px", display: "block" }}>
                  <label className="text_label">Pekerjaan Lebih</label>
                  <div style={{ paddingLeft: "30px" }}>
                    <Input
                      name="pekerjaanLebih"
                      value={premiData.pekerjaanLebih}
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
                  <label className="text_label">Jenis Hari</label>
                  <div style={{ paddingLeft: "30px" }}>
                    <Select
                      name="jenisHari"
                      value={premiData.jenisHari}
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
                  <label className="text_label">Jenis Shift</label>
                  <div style={{ paddingLeft: "30px" }}>
                    <Select
                      name="jenisShift"
                      value={premiData.jenisShift}
                      onChange={(value) =>
                        handleInputChange({
                          target: { name: "jenisShift", value },
                        })
                      }
                      style={{ width: "100%" }}
                    >
                      <Option value="Shift Pagi">Shift Pagi</Option>
                      <Option value="Shift Siang">Shift Siang</Option>
                      <Option value="Shift Malam">Shift Malam</Option>
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
        <p>Apakah Anda yakin ingin mengupdate premi?</p>
      </Modal>
    </div>
  );
};

export default FormEditPremi;
