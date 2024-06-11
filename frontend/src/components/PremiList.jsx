import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  Table,
  Button,
  Input,
  Space,
  DatePicker,
  Row,
  Col,
  Modal,
  message,
} from "antd";
import "../index.css";

const { Option } = Select;

const PremiList = () => {
  const [premis, setPremis] = useState([]);
  const [tanggal, setTanggal] = useState("");
  const [jenisHari, setJenisHari] = useState("Hari Kerja");
  const [jenisShift, setJenisShift] = useState("Shift Pagi");
  const [pekerjaanLebih, setPekerjaanLebih] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterYear, setFilterYear] = useState("");

  useEffect(() => {
    getPremis();
  }, []);

  const getPremis = async () => {
    try {
      const response = await axios.get("http://localhost:5000/premis");
      setPremis(response.data);
    } catch (error) {
      console.log("Error in getPremis:", error);
    }
  };

  const submitPremi = (e) => {
    e.preventDefault();

    Modal.confirm({
      title: "Confirm Submission",
      content: "Are you sure you want to submit this premi?",
      onOk: async () => {
        try {
          await axios.post("http://localhost:5000/premis", {
            tanggal: tanggal,
            jenisHari: jenisHari,
            jenisShift: jenisShift,
            pekerjaanLebih: pekerjaanLebih,
          });
          setTanggal("");
          setJenisHari("Hari Kerja");
          setJenisShift("Shift Pagi");
          setPekerjaanLebih("");
          getPremis();
          message.success("Submission successfully");
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const columns = [
    { title: "No", dataIndex: "index", key: "index" },
    { title: "Tanggal", dataIndex: "tanggal", key: "tanggal" },
    { title: "Jenis Hari", dataIndex: "jenisHari", key: "jenisHari" },
    { title: "Jenis Shift", dataIndex: "jenisShift", key: "jenisShift" },
    {
      title: "Pekerjaan Lebih",
      dataIndex: "pekerjaanLebih",
      key: "pekerjaanLebih",
    },
    {
      title: "Status Approval",
      dataIndex: "statusApproval",
      key: "statusApproval",
    },
    { title: "Bayar TTP1", dataIndex: "bayarTTP1", key: "bayarTTP1" },
  ];

  const formatDate = (dateStr) => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString("id-ID", options);
    return `${formattedDate.split(",")[0]} / ${formattedDate
      .split(",")[1]
      .trim()}`;
  };

  const data = premis.map((premi, index) => {
    const rowData = {
      key: premi.uuid,
      index: index + 1,
      tanggal1: formatDate(premi.tanggal),
      tanggal: premi.tanggal,
      jenisHari: premi.jenisHari,
      jenisShift: premi.jenisShift,
      pekerjaanLebih: premi.pekerjaanLebih,
      statusApproval: premi.statusApproval,
      bayarTTP1: premi.bayarTTP1,
    };

    return rowData;
  });

  const getMonthFromDateString = (dateStr) => {
    const date = new Date(dateStr);
    return date.getMonth() + 1; // getMonth() mengembalikan 0-11, tambahkan 1 untuk bulan yang sesuai
  };

  const handleFilterMonthChange = (value) => {
    setFilterMonth(value);
  };

  const handleFilterStatusChange = (value) => {
    setFilterStatus(value);
  };

  const getYearFromDateString = (dateStr) => {
    const date = new Date(dateStr);
    return date.getFullYear(); // getFullYear() mengembalikan tahun
  };

  const handleFilterYearChange = (value) => {
    setFilterYear(value); // Anda perlu membuat state ini
  };

  const filteredData = data.filter((premi) => {
    const lemburMonth = getMonthFromDateString(premi.tanggal);
    const lemburYear = getYearFromDateString(premi.tanggal);
    const filterMonthNumber = filterMonth ? parseInt(filterMonth, 10) : null;
    const filterYearNumber = filterYear ? parseInt(filterYear, 10) : null;

    if (filterMonth && filterYear && filterStatus) {
      return (
        lemburMonth === filterMonthNumber &&
        lemburYear === filterYearNumber &&
        premi.statusApproval === filterStatus
      );
    } else if (filterMonth && filterYear) {
      return (
        lemburMonth === filterMonthNumber && lemburYear === filterYearNumber
      );
    } else if (filterMonth) {
      return lemburMonth === filterMonthNumber;
    } else if (filterYear) {
      return lemburYear === filterYearNumber;
    } else if (filterStatus) {
      return premi.statusApproval === filterStatus;
    }

    return true;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1
        style={{
          fontSize: "24px",
          marginBottom: "20px",
          color: "black",
          fontWeight: "bold",
        }}
      >
        Premi
      </h1>
      <div style={{ marginBottom: "20px" }}>
        <h3 className="judul_font" style={{ color: "#168FF0" }}>
          Buat Pelaporan Premi mu!
        </h3>
        <p className="text_isi buram">Silahkan isi dengan sebenar-benarnya!</p>

        <div>
          <form onSubmit={submitPremi}>
            <Row gutter={16}>
              <Col span={12}>
                <Space style={{ marginBottom: "10px", display: "block" }}>
                  <label className="text_label">Tanggal</label>
                  <div style={{ paddingLeft: "30px" }}>
                    <DatePicker
                      style={{ width: "100%" }}
                      value={tanggal}
                      onChange={(date) => setTanggal(date)}
                      required
                    />
                  </div>
                </Space>

                <Space style={{ marginBottom: "10px", display: "block" }}>
                  <label className="text_label">Pekerjaan Lebih</label>
                  <div style={{ paddingLeft: "30px" }}>
                    <Input
                      type="text"
                      value={pekerjaanLebih}
                      onChange={(e) => setPekerjaanLebih(e.target.value)}
                      required
                    />
                  </div>
                </Space>
                <div style={{ paddingLeft: "30px" }}>
                  <Button type="primary" htmlType="submit">
                    Ajukan Premi
                  </Button>
                </div>
              </Col>
              <Col span={12}>
                <Space style={{ marginBottom: "10px", display: "block" }}>
                  <label style={{ marginBottom: "5px" }}>Jenis Hari</label>
                  <Select
                    value={jenisHari}
                    onChange={(value) => setJenisHari(value)}
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
                </Space>

                <Space style={{ marginBottom: "10px", display: "block" }}>
                  <label style={{ marginBottom: "5px" }}>Jenis Shift</label>
                  <Select
                    value={jenisShift}
                    onChange={(value) => setJenisShift(value)}
                    style={{ width: "100%" }}
                  >
                    <Option value="Shift Pagi">Shift Pagi</Option>
                    <Option value="Shift Siang">Shift Siang</Option>
                    <Option value="Shift Malam">Shift Malam</Option>
                  </Select>
                </Space>
              </Col>
            </Row>
          </form>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h2 className="judul_font2" style={{ color: "#168FF0" }}>
            Daftar Pengajuan Premi
          </h2>
        </div>
        <div>
          <Row
            gutter={80} // meningkatkan jarak antara kolom menjadi 100px
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              justifyContent: "flex-end",
              marginRight: "30px",
            }}
          >
            <Col span={6}>
              <Space>
                <label>Tahun:</label>
                <Select
                  value={filterYear}
                  onChange={handleFilterYearChange}
                  style={{ width: "10vw" }}
                >
                  <Option value="">Semua</Option>
                  <Option value="2023">2023</Option>
                  <Option value="2024">2024</Option>
                </Select>
              </Space>
            </Col>
            <Col span={6}>
              <Space>
                <label>Bulan:</label>
                <Select
                  value={filterMonth}
                  onChange={handleFilterMonthChange}
                  style={{ width: "10vw" }}
                >
                  <Option value="">Semua</Option>
                  <Option value="1">Januari</Option>
                  <Option value="2">Februari</Option>
                  <Option value="3">Maret</Option>
                  <Option value="4">April</Option>
                  <Option value="5">Mei</Option>
                  <Option value="6">Juni</Option>
                  <Option value="7">Juli</Option>
                  <Option value="8">Agustus</Option>
                  <Option value="9">September</Option>
                  <Option value="10">Oktober</Option>
                  <Option value="11">November</Option>
                  <Option value="12">Desember</Option>
                </Select>
              </Space>
            </Col>
            <Col span={6}>
              <Space>
                <label>Status:</label>
                <Select
                  value={filterStatus}
                  onChange={handleFilterStatusChange}
                  style={{ width: "10vw" }}
                >
                  <Option value="">Semua</Option>
                  <Option value="Menunggu">Menunggu</Option>
                  <Option value="Disetujui">Disetujui</Option>
                  <Option value="Ditolak">Ditolak</Option>
                </Select>
              </Space>
            </Col>
          </Row>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Table
          className="custom-table"
          columns={columns}
          dataSource={filteredData}
          size="small"
          pagination={false}
        />
      </div>
    </div>
  );
};

export default PremiList;
