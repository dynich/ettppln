import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Table, Button, Space, Row, Col, Modal, message, Form } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import "../index.css"

//option
const { Option } = Select;

const { confirm } = Modal;


const ApprovalPiketList = () => {

  const [pikets, setPiket] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const { id } = useParams();
  const [statusApproval, setStatusApproval] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('2023');
  const [filterYear, setFilterYear] = useState('');


  const exportToExcel = async () => {
    if (!selectedMonth || !selectedYear) {
      message.error('Silakan pilih bulan dan tahun terlebih dahulu');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/export/aggregated-pikets/${selectedMonth}/${selectedYear}`);
      const dataForExcel = response.data.map((item, index) => {
        // Transformasi data sesuai kebutuhan
        return {
          No: index + 1,
          Nama: item.user.name,
          NIP: item.user.nip,
          Jabatan: item.user.jabatan,
          "Jenjang Jabatan": item.user.jenjangJabatan,
          Grade: item.user.grade,
          "Skala Gaji Dasar": item.user.skalaGajiDasar,
          Atasan: item.user.atasan,
          Tanggal: item.tanggal,
          "Jam Mulai": item.jamMulai,
          "Jam Selesai": item.jamSelesai,
          "Jumlah Hari Simbol 1": item.jumlahHariSimbol1,
          "Jumlah Hari Simbol 2": item.jumlahHariSimbol2,
          "Jumlah Hari Simbol 3": item.jumlahHariSimbol3,
          "Bayar Piket Rutin": item.bayarPiketRutin,
          "Bayar Piket Khusus": item.bayarPiketKhusus,
          'statusApproval': item.statusApproval,
          'admin1Approval': item.admin1Approval,
          'admin2Approval': item.admin2Approval,
          'superadminApproval': item.superadminApproval,

        };
      });

      const ws = XLSX.utils.json_to_sheet(dataForExcel);

      const columnWidths = [
        { wch: 5 },  // Lebar untuk kolom 'No'
        { wch: 20 }, // Lebar untuk kolom 'Nama'
        { wch: 12 }, // Lebar untuk kolom 'NIP'
        { wch: 40 }, // Lebar untuk 'Jabatan'
        { wch: 15 }, // Lebar untuk 'Jenjang Jabatan'
        { wch: 10 }, // Lebar untuk 'Grade'
        { wch: 18 }, // Lebar untuk 'Skala Gaji Dasar'
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },// Lebar untuk 'Atasan'
        { wch: 15 }, // Lebar untuk 'Jumlah Hari Simbol 1'
        { wch: 15 }, // Lebar untuk 'Jumlah Hari Simbol 2'
        { wch: 15 }, // Lebar untuk 'Jumlah Hari Simbol 3'
        { wch: 18 }, // Lebar untuk 'Bayar Piket Rutin'
        { wch: 18 }, // Lebar untuk 'Bayar Piket Khusus'
        { wch: 18 }, // Lebar untuk 'Status Approval'
        { wch: 18 }, // Lebar untuk 'Admin 1 Approval'
        { wch: 18 }, // Lebar untuk 'Admin 2 Approval'
        { wch: 18 }, // Lebar untuk 'Superadmin Approval'

      ];

      ws['!cols'] = columnWidths;
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Rekap Lembur Keseluruhan");
      XLSX.writeFile(wb, "Rekap Piket Keseluruhan.xlsx");
    } catch (error) {
      console.log("Error in exporting:", error);
    }
  };

  const exportToExcelByMonth = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/export/rekap-pikets/${selectedMonth}/${selectedYear}`);
      const dataForExcel = response.data.map((item, index) => {
        // Transformasi data sesuai kebutuhan
        return {
          No: index + 1,
          Nama: item.user.name,
          NIP: item.user.nip,
          Jabatan: item.user.jabatan,
          "Jenjang Jabatan": item.user.jenjangJabatan,
          Grade: item.user.grade,
          "Skala Gaji Dasar": item.user.skalaGajiDasar,
          Atasan: item.user.atasan,
          Tanggal: item.tanggal,
          "Jam Mulai": item.jamMulai,
          "Jam Selesai": item.jamSelesai,
          "Bayar Piket Rutin": item.bayarPiketRutin,
          "Bayar Piket Khusus": item.bayarPiketKhusus,
          'statusApproval': item.statusApproval,
          'admin1Approval': item.admin1Approval,
          'admin2Approval': item.admin2Approval,
          'superadminApproval': item.superadminApproval,
        };
      });

      const ws = XLSX.utils.json_to_sheet(dataForExcel);

      const columnWidths = [
        { wch: 5 },  // Lebar untuk kolom 'No'
        { wch: 20 }, // Lebar untuk kolom 'Nama'
        { wch: 12 }, // Lebar untuk kolom 'NIP'
        { wch: 40 }, // Lebar untuk 'Jabatan'
        { wch: 15 }, // Lebar untuk 'Jenjang Jabatan'
        { wch: 10 }, // Lebar untuk 'Grade'
        { wch: 18 }, // Lebar untuk 'Skala Gaji Dasar'
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },// Lebar untuk 'Atasan'
        { wch: 18 }, // Lebar untuk 'Bayar Piket Rutin'
        { wch: 18 }, // Lebar untuk 'Bayar Piket Khusus'
        { wch: 18 }, // Lebar untuk 'Status Approval'
        { wch: 18 }, // Lebar untuk 'Admin 1 Approval'
        { wch: 18 }, // Lebar untuk 'Admin 2 Approval'
        { wch: 18 }, // Lebar untuk 'Superadmin Approval'
      ];

      ws['!cols'] = columnWidths;
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Per Bulan");
      XLSX.writeFile(wb, "Rekap Piket Keseluruhan by Month.xlsx");
    } catch (error) {
      console.log("Error in exporting by month:", error);
    }
  };

  useEffect(() => {
    getApprovalPiket();
  }, []);

  const getApprovalPiket = async () => {
    try {
      const response = await axios.get('http://localhost:5000/pikets/approval');
      setPiket(response.data);
    } catch (error) {
      console.log("Error in getPikets:", error);
    }
  };

  const { confirm } = Modal;

  const approveAllPending = async () => {
    confirm({
      title: 'Are you sure you want to approve all pending entries?',
      content: 'This action will update the status of all pending entries to "Disetujui".',
      onOk: async () => {
        try {
          // Call the new bulk approval endpoint
          await axios.patch('http://localhost:5000/pikets/approve-all');
  
          // Refresh the lembur list
          await getApprovalPiket();
  
          // Show success message
          message.success("All pending approvals have been approved");
        } catch (error) {
          console.error("Error in approveAllPending:", error);
          message.error("Failed to approve all pending entries");
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  useEffect(() => {
    if (id) {
      const getPiketById = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/pikets/${id}`
          );
          setStatusApproval(response.data.statusApproval);
        } catch (error) {
          if (error.response) {
            setMsg(error.response.data.msg);
          }
        }
      };
      getPiketById();
    }
  }, [id]);

  const updateStatus = async (piketId, approvalStatus) => {
    try {
      await axios.patch(`http://localhost:5000/pikets/${piketId}/status`, {
        statusApproval: approvalStatus,
      });
      getApprovalPiket();
      message.success('Status updated successfully');
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  const showConfirm = (piketId, approvalStatus) => {
    confirm({
      title: 'Do you want to update the status?',
      content: 'This action cannot be undone',
      onOk() {
        updateStatus(piketId, approvalStatus);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const deletePiket = async (piketId) => {
    await axios.delete(`http://localhost:5000/pikets/${piketId}`);
    getApprovalPiket();
  };

  const generateColumns = () => {
    let columns = [
      { title: 'No', dataIndex: 'index', key: 'index' },
      { title: 'Tanggal', dataIndex: 'tanggal', key: 'tanggal' },
      { title: 'Jam Mulai', dataIndex: 'jamMulai', key: 'jamMulai' },
      { title: 'Jam Selesai', dataIndex: 'jamSelesai', key: 'jamSelesai' },
      { title: 'Jenis Piket', dataIndex: 'jenisPiket', key: 'jenisPiket' },
      { title: 'Jenis Hari', dataIndex: 'jenisHari', key: 'jenisHari' },
      { title: 'Pekerjaan Lebih', dataIndex: 'pekerjaanLebih', key: 'pekerjaanLebih' },
      { title: 'Status Approval', dataIndex: 'statusApproval', key: 'statusApproval' },
      { title: 'Bayar Piket Rutin', dataIndex: 'bayarPiketRutin', key: 'bayarPiketRutin' },
      { title: 'Bayar Piket Khusus', dataIndex: 'bayarPiketKhusus', key: 'bayarPiketKhusus' },
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
    ];


    if (user && user.role) {
      if (user.role === 'admin1') {
        columns = [
          ...columns,
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Jabatan', dataIndex: 'jabatan', key: 'jabatan' },
          { title: 'Grade', dataIndex: 'grade', key: 'grade' },
          { title: 'Admin1 Approval', dataIndex: 'admin1Approval', key: 'admin1Approval' },
          {
            title: (
              <div>
                Actions
                <Button
                  type="primary"
                  onClick={approveAllPending}
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#04AA6D",
                    borderColor: "#04AA6D",
                    color: "white",
                    fontSize: "12px",
                  }}
                >
                  Setujui Semua
                </Button>
              </div>
            ),
            dataIndex: 'actions', key: 'actions', render: (_, record) => (
              <Space>
                {record.admin1Approval !== 'Disetujui' && record.admin1Approval !== 'Ditolak' && (
                  <Link to={`/approval/approvalpiket/edit/${record.key}`}>
                    <Button type="primary" style={{ fontSize: "12px" }}>
                      Edit
                    </Button>
                  </Link>
                )}
                {record.admin1Approval !== 'Ditolak' && (
                  <Button type="primary" disabled={record.admin1Approval === 'Disetujui'} onClick={() => { showConfirm(record.key, 'Disetujui'); record.admin1Approval = 'Disetujui'; }} style={{ backgroundColor: '#04AA6D', borderColor: '#04AA6D', color: 'white', fontSize: "12px" }}>
                    Setujui
                  </Button>
                )}
                {record.admin1Approval !== 'Disetujui' && (
                  <Button type="danger" disabled={record.admin1Approval === 'Ditolak'} onClick={() => { showConfirm(record.key, 'Ditolak'); record.admin1Approval = 'Ditolak'; }} style={{ backgroundColor: '#f5222d', borderColor: '#f5222d', color: 'white', fontSize: "12px" }}>
                    Tolak
                  </Button>
                )}
              </Space>
            )
          },
        ];
      } else if (user.role === 'admin2') {
        columns = [
          ...columns,
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'NIP', dataIndex: 'nip', key: 'nip' },
          { title: 'Jabatan', dataIndex: 'jabatan', key: 'jabatan' },
          { title: 'Grade', dataIndex: 'grade', key: 'grade' },
          { title: 'Atasan', dataIndex: 'atasan', key: 'atasan' },
          { title: 'Admin1 Approval', dataIndex: 'admin1Approval', key: 'admin1Approval' },
          { title: 'Admin2 Approval', dataIndex: 'admin2Approval', key: 'admin2Approval' },
          {
            title: 'Actions', dataIndex: 'actions', key: 'actions', render: (_, record) => (
              <Space>
                {record.atasan === 'Hariady Bayu Aji' && record.admin2Approval !== 'Disetujui' && record.admin2Approval !== 'Ditolak' && (
                  <Link to={`/approval/approvalpiket/edit/${record.key}`}>
                    <Button type='primary' style={{ fontSize: "12px" }}>
                      Edit
                    </Button>
                  </Link>
                )}
                {record.admin2Approval !== 'Ditolak' && (
                  <Button type="primary" disabled={record.admin2Approval === 'Disetujui'} onClick={() => { showConfirm(record.key, 'Disetujui'); record.admin2Approval = 'Disetujui'; }} style={{ backgroundColor: '#04AA6D', borderColor: '#04AA6D', color: 'white', fontSize: "12px" }}>
                    Setujui
                  </Button>
                )}
                {record.admin2Approval !== 'Disetujui' && (
                  <Button type="danger" disabled={record.admin2Approval === 'Ditolak'} onClick={() => { showConfirm(record.key, 'Ditolak'); record.admin2Approval = 'Ditolak'; }} style={{ backgroundColor: '#f5222d', borderColor: '#f5222d', color: 'white', fontSize: "12px" }}>
                    Tolak
                  </Button>
                )}
              </Space>
            )
          },
        ];
      } else if (user.role === 'superadmin') {
        columns = [
          ...columns,
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'NIP', dataIndex: 'nip', key: 'nip' },
          { title: 'Jabatan', dataIndex: 'jabatan', key: 'jabatan' },
          { title: 'Grade', dataIndex: 'grade', key: 'grade' },
          { title: 'Atasan', dataIndex: 'atasan', key: 'atasan' },
          { title: 'Admin1 Approval', dataIndex: 'admin1Approval', key: 'admin1Approval' },
          { title: 'Admin2 Approval', dataIndex: 'admin2Approval', key: 'admin2Approval' },
          { title: 'Superadmin Approval', dataIndex: 'superadminApproval', key: 'superadminApproval' },
          {
            title: 'Actions', dataIndex: 'actions', key: 'actions', render: (_, record) => (
              <Space>
                {record.superadminApproval !== 'Ditolak' && (
                  <Button type="primary" disabled={record.superadminApproval === 'Disetujui'} onClick={() => { showConfirm(record.key, 'Disetujui'); record.superadminApproval = 'Disetujui'; }} style={{ backgroundColor: '#04AA6D', borderColor: '#04AA6D', color: 'white', fontSize: "12px" }}>
                    Setujui
                  </Button>
                )}
                {record.superadminApproval !== 'Disetujui' && (
                  <Button type="danger" disabled={record.superadminApproval === 'Ditolak'} onClick={() => { showConfirm(record.key, 'Ditolak'); record.superadminApproval = 'Ditolak'; }} style={{ backgroundColor: '#f5222d', borderColor: '#f5222d', color: 'white', fontSize: "12px" }}>
                    Tolak
                  </Button>
                )}
                <Button type="danger" onClick={() => deletePiket(record.key)} style={{ fontSize: "12px" }}>
                  Delete
                </Button>
              </Space>
            )
          },
        ];
      }
    }

    return columns;
  };

  const columns = generateColumns();

  const formatDate = (dateStr) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString('id-ID', options);
    return `${formattedDate.split(',')[0]} / ${formattedDate.split(',')[1].trim()}`;
  };

  const data = pikets.map((piket, index) => {
    const rowData = {
      key: piket.uuid,
      index: index + 1,
      name: piket.user.name,
      nip: piket.user.nip,
      jabatan: piket.user.jabatan,
      grade: piket.user.grade,
      atasan: piket.user.atasan,
      tanggal1: formatDate(piket.tanggal),
      tanggal: piket.tanggal,
      jamMulai: piket.jamMulai,
      jamSelesai: piket.jamSelesai,
      jenisPiket: piket.jenisPiket,
      jenisHari: piket.jenisHari,
      pekerjaanLebih: piket.pekerjaanLebih,
      statusApproval: piket.statusApproval,
      bayarPiketRutin: piket.bayarPiketRutin,
      bayarPiketKhusus: piket.bayarPiketKhusus,
      admin1Approval: piket.admin1Approval,
      admin2Approval: piket.admin2Approval,
      superadminApproval: piket.superadminApproval,
      buktiPiket: piket.buktiPiket,

    };

    return rowData;
  });

  const getMonthFromDateString = (dateStr) => {
    const date = new Date(dateStr);
    return date.getMonth() + 1; // getMonth() mengembalikan 0-11, tambahkan 1 untuk bulan yang sesuai
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
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
    const piketMonth = getMonthFromDateString(piket.tanggal);
    const piketYear = getYearFromDateString(piket.tanggal);
    const filterMonthNumber = filterMonth ? parseInt(filterMonth, 10) : null;
    const filterYearNumber = filterYear ? parseInt(filterYear, 10) : null;

    if (filterMonth && filterYear && filterStatus) {
      return piketMonth === filterMonthNumber && piketYear === filterYearNumber && piket.statusApproval === filterStatus;
    } else if (filterMonth && filterYear) {
      return piketMonth === filterMonthNumber && piketYear === filterYearNumber;
    } else if (filterMonth) {
      return piketMonth === filterMonthNumber;
    } else if (filterYear) {
      return piketYear === filterYearNumber;
    } else if (filterStatus) {
      return piket.statusApproval === filterStatus;
    }

    return true;
  });


  return (
    <div className="container">
      <div className="header">
        <h2
          className="judul_font2"
          style={{ color: "#168FF0", marginTop: "30px" }}
        >
          Daftar Pengajuan Piket
        </h2>
      </div>
      <p className="text_isi">
        Berikut adalah daftar pengajuan piket yang masuk.
      </p>

      <div
        className="filter-download-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div className="filter-box">
          <Row
            gutter={30}
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              marginLeft: "14px",
            }}
          >
            <Col span={8}>
              <Form layout="vertical">
                <Form.Item label="Tahun">
                  <Select
                    value={filterYear}
                    onChange={handleFilterYearChange}
                    style={{ width: "100%" }}
                  >
                    <Option value="">Semua</Option>
                    <Option value="2023">2023</Option>
                    <Option value="2024">2024</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Col>
            <Col span={8}>
              <Form layout="vertical">
                <Form.Item label="Bulan">
                  <Select
                    value={filterMonth}
                    onChange={handleFilterMonthChange}
                    style={{ width: "100%" }}
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
                </Form.Item>
              </Form>
            </Col>
            <Col span={8}>
              <Form layout="vertical">
                <Form.Item label="Status Approval">
                  <Select
                    placeholder="Filter Status Approval"
                    style={{ width: "100%" }}
                    onChange={handleFilterStatusChange}
                    value={filterStatus}
                  >
                    <Option value="">Semua</Option>
                    <Option value="Menunggu">Menunggu</Option>
                    <Option value="Disetujui">Disetujui</Option>
                    <Option value="Ditolak">Ditolak</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>

        <div className="download-box">
          {user && user.role === "superadmin" && (
            <>
              <div className="download-options">
                <Row
                  gutter={30}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    marginLeft: "80px",
                  }}
                >
                  <Col span={5}>
                    <Form layout="vertical">
                      <Form.Item label="Pilih Tahun">
                        <Select
                          placeholder="Pilih Tahun"
                          style={{ width: "100%" }}
                          onChange={handleYearChange}
                          value={selectedYear}
                        >
                          <Option value="2023">2023</Option>
                          <Option value="2024">2024</Option>
                        </Select>
                      </Form.Item>
                    </Form>
                  </Col>

                  <Col span={5}>
                    <Form layout="vertical">
                      <Form.Item label="Pilih Bulan">
                        <Select
                          placeholder="Pilih Bulan"
                          style={{ width: "100%" }}
                          onChange={handleMonthChange}
                          value={selectedMonth}
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
                      </Form.Item>
                    </Form>
                  </Col>
                  <Col span={6}>
                    <Form layout="vertical">
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={exportToExcelByMonth}
                        style={{
                          background: "#04AA6D",
                          borderColor: "#04AA6D",
                          color: "white",
                          marginTop: "28px",
                        }}
                      >
                        Rekap Terpisah
                      </Button>
                    </Form>
                  </Col>
                  <Col span={8}>
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={exportToExcel}
                      style={{
                        background: "#168FF0",
                        borderColor: "#168FF0",
                        color: "white",
                        marginTop: "28px",
                      }}
                    >
                      Rekap Gabungan
                    </Button>
                  </Col>
                </Row>
              </div>
            </>
          )}
        </div>
      </div>

      <Table
        className="custom-table"
        columns={columns}
        dataSource={filteredData}
        size="middle"
        pagination={false}
        bordered
        rowClassName={(record, index) =>
          index % 2 === 0 ? "even-row" : "odd-row"
        }
      />
    </div>
  );

};

export default ApprovalPiketList;
