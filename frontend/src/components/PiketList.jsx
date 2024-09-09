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
import { jsPDF } from "jspdf"; // Import jsPDF
import "jspdf-autotable"; // Import jspdf-autotable
import "../index.css";
import { Link } from "react-router-dom";

const { Option } = Select;

const PiketList = () => {
  const [pikets, setPikets] = useState([]);
  const [tanggal, setTanggal] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [jenisPiket, setJenisPiket] = useState("");
  const [jenisHari, setJenisHari] = useState("Hari Kerja");
  const [pekerjaanLebih, setPekerjaanLebih] = useState("");
  const [buktiPiket, setBuktiPiket] = useState(null);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isFileValid, setIsFileValid] = useState(true);
  const [users, setUsers] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const maxSize = 1000000; // 1MB in bytes
      if (file.size > maxSize) {
        message.error("Max file size is 1MB.");
        setIsFileValid(false);
        return;
      } else {
        setIsFileValid(true);
      }
      setBuktiPiket(file);
    }
  };

  useEffect(() => {
    // Lakukan permintaan HTTP untuk mengambil data pengguna dari server
    axios
      .get("http://localhost:5000/users")
      .then((response) => {
        // Jika permintaan berhasil, simpan data pengguna dalam state users
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error in getUsers:", error);
      });
  }, []);

  useEffect(() => {
    getPikets();
  }, []);

  const getPikets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/pikets");
      setPikets(response.data);
    } catch (error) {
      console.log("Error in getPikets:", error);
    }
  };

  const submitPiket = (e) => {
    e.preventDefault();
    Modal.confirm({
      title: "Confirm Submission",
      content: "Are you sure you want to submit this piket?",
      onOk: async () => {
        try {
          const formData = new FormData();
          formData.append("tanggal", tanggal);
          formData.append("jamMulai", jamMulai);
          formData.append("jamSelesai", jamSelesai);
          formData.append("jenisPiket", jenisPiket);
          formData.append("jenisHari", jenisHari);
          formData.append("pekerjaanLebih", pekerjaanLebih);
          formData.append("buktiPiket", buktiPiket);

          await axios.post("http://localhost:5000/pikets", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          setTanggal("");
          setJamMulai("");
          setJamSelesai("");
          setJenisPiket("");
          setJenisHari("Hari Kerja");
          setPekerjaanLebih("");
          setBuktiPiket("");
          getPikets();
          message.success("Submission successfully");
        } catch (error) {
          console.error("Error in submit Piket:", error);
          message.error("Submission failed");
        }
      },
    });
  };

  const columns = [
    { title: "No", dataIndex: "index", key: "index" },
    { title: "Tanggal", dataIndex: "tanggal", key: "tanggal" },
    { title: "Jam Mulai", dataIndex: "jamMulai", key: "jamMulai" },
    { title: "Jam Selesai", dataIndex: "jamSelesai", key: "jamSelesai" },
    { title: "Jenis Piket", dataIndex: "jenisPiket", key: "jenisPiket" },
    { title: "Jenis Hari", dataIndex: "jenisHari", key: "jenisHari" },
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
    {
      title: "Bayar Piket Rutin",
      dataIndex: "bayarPiketRutin",
      key: "bayarPiketRutin",
    },
    {
      title: "Bayar Piket Khusus",
      dataIndex: "bayarPiketKhusus",
      key: "bayarPiketKhusus",
    },
    {
      title: "Bukti Piket",
      dataIndex: "buktiPiket",
      key: "buktiPiket",
      render: (text, record) =>
        record.buktiPiket ? (
          <a
            href={`http://localhost:5000/${record.buktiPiket}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Lihat Bukti
          </a>
        ) : null,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) =>
        record.statusApproval === "Disetujui" ? (
          <Link
            onClick={() => generatePDF(record, users)}
            style={{ fontSize: "12px" }}
          >
            Download PDF
          </Link>
        ) : null,
    },
  ];

  const formatDateWithoutDay = (dateStr) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString("id-ID", options);
    return `${formattedDate.split(",")[0]}`;
  };

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

  const data = pikets.map((piket, index) => {
    const rowData = {
      key: piket.uuid,
      index: index + 1,
      nama: piket.user.name,
      nip: piket.user.nip,
      grade: piket.user.grade,
      jabatan: piket.user.jabatan,
      bagian: piket.user.bagian,
      unitKerja: piket.user.unitKerja,
      atasan: piket.user.atasan,
      tanggal2: formatDate(piket.tanggal),
      tanggal1: formatDateWithoutDay(piket.tanggal),
      tanggal: piket.tanggal,
      jamMulai: piket.jamMulai,
      jamSelesai: piket.jamSelesai,
      jenisPiket: piket.jenisPiket,
      jenisHari: piket.jenisHari,
      pekerjaanLebih: piket.pekerjaanLebih,
      statusApproval: piket.statusApproval,
      bayarPiketRutin: piket.bayarPiketRutin,
      bayarPiketKhusus: piket.bayarPiketKhusus,
      buktiPiket: piket.buktiPiket,
    };

    return rowData;
  });

  const generatePDF = async (rowData, users) => {
    if (!Array.isArray(users)) {
      console.error("Data users tidak valid");
      return;
    }
    const atasanName = rowData.atasan; // Nama atasan dari data piket
    let atasanJabatan = "";

    // Loop melalui data pengguna (Users)
    for (const user of users) {
      if (user.name === atasanName) {
        atasanJabatan = user.jabatan; // Mengambil jabatan dari pengguna yang sesuai
        break; // Berhenti loop setelah menemukan yang sesuai
      }
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Logo
    const img = new Image();
    img.src = "/pln_power.png"; // Lokasi logo di folder "public"
    img.crossOrigin = "Anonymous"; // Menambahkan atribut crossOrigin agar gambar dapat diakses dari domain yang berbeda
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext("2d");
      context.drawImage(img, 0, 0, img.width, img.height);
      const dataUrl = canvas.toDataURL("image/png");
      pdf.addImage(dataUrl, "PNG", 20, 13, 50, 15);

      pdf.setFontSize(8);
      pdf.text("Lampiran 4", 120, 15);
      pdf.setFontSize(8);
      pdf.text("Keputusan Direksi PT Indonesia Power", 120, 20);
      pdf.setFontSize(8);
      pdf.text("Nomor      : 176.K/010/2013", 120, 25);
      pdf.setFontSize(8);
      pdf.text("Tanggal    : 14 November 2014", 120, 30);

      pdf.setLineWidth(1.15);
      pdf.line(20, 35, pdf.internal.pageSize.width - 20, 35);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("SURAT PERINTAH KERJA LEBIH", 105, 45, {
        align: "center",
        underline: true,
      });
      pdf.setLineWidth(0.5);
      pdf.line(72, 46, 138, 46);

      pdf.setFont("helvetica", "normal");

      pdf.setFontSize(10); // Mengubah font menjadi Arial dan normal
      pdf.text("Nama / NIP / Grade", 20, 57);
      pdf.text(`: ${rowData.nama} / ${rowData.nip} / ${rowData.grade}`, 70, 57);
      pdf.text("Jabatan", 20, 65);
      pdf.text(`: ${rowData.jabatan}`, 70, 65);
      pdf.text("Divisi / Bagian / Bidang", 20, 73);
      pdf.text(`: ${rowData.bagian}`, 70, 73);
      pdf.text("Unit Kerja", 20, 81);
      pdf.text(`: ${rowData.unitKerja}`, 70, 81);
      pdf.text("Kerja Lebih Hari / Tanggal", 20, 89);
      pdf.text(`: ${rowData.tanggal2}`, 70, 89);
      pdf.text("Jam Mulai", 20, 97);
      pdf.text(`: ${rowData.jamMulai}`, 70, 97);
      pdf.text("Jam Selesai", 20, 105);
      pdf.text(`: ${rowData.jamSelesai}`, 70, 105);
      pdf.text("Jenis Piket", 20, 113);
      pdf.text(": Piket", 70, 113);
      pdf.text("Pekerjaan Kerja Lebih", 20, 121);
      pdf.text(`: ${rowData.pekerjaanLebih}`, 70, 121);

      pdf.text("Demikian agar dilaksanakan dengan sebaik-baiknya.", 20, 137);

      pdf.text("Makassar, ", 120, 152);
      pdf.text(`${rowData.tanggal1}`, 137, 152);

      pdf.setFontSize(10);
      pdf.text("Menyetujui", 20, 160);
      pdf.text("Manager UPDK TELLO", 20, 165);
      pdf.text("Yang Memberi Perintah,", 120, 160);
      pdf.text(`${atasanJabatan}`, 120, 165); // Mengubah ke huruf kapital

      const ttdManager = new Image();
      ttdManager.src = "/Bayu_Aji.png"; // Ganti dengan path gambar tanda tangan Anda
      img.crossOrigin = "Anonymous";
      ttdManager.onload = function () {
        const ttdCanvas = document.createElement("canvas");
        ttdCanvas.width = ttdManager.width;
        ttdCanvas.height = ttdManager.height;
        const ttdContext = ttdCanvas.getContext("2d");
        ttdContext.drawImage(
          ttdManager,
          0,
          0,
          ttdManager.width,
          ttdManager.height
        );
        const ttdDataUrl = ttdCanvas.toDataURL("image/png");
        pdf.addImage(ttdDataUrl, "PNG", 20, 177, 50, 13); // Atur posisi dan ukuran gambar tanda tangan sesuai kebutuhan

        const stempel = new Image();
        stempel.src = "/stempel_UBPTello.png"; // Ganti dengan path gambar tanda tangan Anda
        img.crossOrigin = "Anonymous";
        stempel.onload = function () {
          const stempelCanvas = document.createElement("canvas");
          stempelCanvas.width = stempel.width;
          stempelCanvas.height = stempel.height;
          const stempelContext = stempelCanvas.getContext("2d");
          stempelContext.drawImage(
            stempel,
            0,
            0,
            stempel.width,
            stempel.height
          );
          const stempelDataUrl = stempelCanvas.toDataURL("image/png");
          pdf.addImage(stempelDataUrl, "PNG", 10, 164, 40, 40); // Atur posisi dan ukuran gambar tanda tangan sesuai kebutuhan

          const ttdAtasan = new Image();
          const atasanFileName = atasanName.replace(/ /g, "_").toUpperCase(); // Mengubah spasi menjadi underscore dan ke huruf kapital
          ttdAtasan.src = `/ttd_Atasan/${atasanFileName}.png`; // Path gambar tanda tangan dinamis berdasarkan nama atasan
          img.crossOrigin = "Anonymous";
          ttdAtasan.onload = function () {
            const ttdCanvas = document.createElement("canvas");
            ttdCanvas.width = ttdAtasan.width;
            ttdCanvas.height = ttdAtasan.height;
            const ttdContext = ttdCanvas.getContext("2d");
            ttdContext.drawImage(
              ttdAtasan,
              0,
              0,
              ttdAtasan.width,
              ttdAtasan.height
            );
            const ttdDataUrl = ttdCanvas.toDataURL("image/png");
            pdf.addImage(ttdDataUrl, "PNG", 120, 160, 40, 30); // Atur posisi dan ukuran gambar tanda tangan sesuai kebutuhan

            pdf.setLineWidth(0.5);
            pdf.line(20, 190, 80, 190);
            pdf.line(120, 190, 180, 190);

            pdf.text("(HARIADY BAYU AJI)", 20, 195, { fontWeight: 400 });
            pdf.text(`(${rowData.atasan.toUpperCase()})`, 120, 195); // Mengubah ke huruf kapital

            pdf.save("piket.pdf");
          };
        };
      };
    };
  };

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

  const filteredData = data.filter((piket) => {
    const lemburMonth = getMonthFromDateString(piket.tanggal);
    const lemburYear = getYearFromDateString(piket.tanggal);
    const filterMonthNumber = filterMonth ? parseInt(filterMonth, 10) : null;
    const filterYearNumber = filterYear ? parseInt(filterYear, 10) : null;

    if (filterMonth && filterYear && filterStatus) {
      return (
        lemburMonth === filterMonthNumber &&
        lemburYear === filterYearNumber &&
        piket.statusApproval === filterStatus
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
      return piket.statusApproval === filterStatus;
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
        Piket
      </h1>
      <div style={{ marginBottom: "20px" }}>
        <h3 className="judul_font" style={{ color: "#168FF0" }}>
          Buat Surat Kehadiran Piket mu!
        </h3>
        <p className="text_isi buram">Silahkan isi dengan sebenar-benarnya!</p>

        <div>
          <form onSubmit={submitPiket}>
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
                  <div style={{ paddingLeft: "30px" }}>
                    <label style={{ marginBottom: "5px" }}>Jenis Piket</label>
                    <Select
                      value={jenisPiket}
                      onChange={(value) => setJenisPiket(value)}
                      style={{ width: "100%" }}
                    >
                      <Option value="Piket Rutin">Piket Rutin</Option>
                      <Option value="Piket Khusus">Piket Khusus</Option>
                    </Select>
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
                <Space style={{ marginBottom: "10px", display: "block" }}>
                  <label className="text_label">Bukti Piket</label>
                  <div style={{ paddingLeft: "30px" }}>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </Space>
                <div style={{ paddingLeft: "30px", paddingTop: "5px" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!isFileValid}
                  >
                    Ajukan Piket
                  </Button>
                </div>
              </Col>
              <Col span={12}>
                <Space style={{ marginBottom: "10px", display: "block" }}>
                  <label style={{ marginBottom: "5px" }}>Jam Mulai</label>
                  <Input
                    type="time"
                    value={jamMulai}
                    onChange={(e) => setJamMulai(e.target.value)}
                    required
                  />
                </Space>
                <Space style={{ marginBottom: "10px", display: "block" }}>
                  <label style={{ marginBottom: "5px" }}>Jam Selesai</label>
                  <Input
                    type="time"
                    value={jamSelesai}
                    onChange={(e) => setJamSelesai(e.target.value)}
                    required
                  />
                </Space>
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
            Daftar Pengajuan Piket
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

export default PiketList;
