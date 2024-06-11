import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Table, Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "../index.css";

const Userlist = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (userId) => {
    await axios.delete(`http://localhost:5000/users/${userId}`);
    getUsers();
  };

  const columns = [
    { title: "No", dataIndex: "index", key: "index" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "NIP", dataIndex: "nip", key: "nip" },
    {
      title: "Status Pegawai",
      dataIndex: "statusPegawai",
      key: "statusPegawai",
    },
    { title: "Jabatan", dataIndex: "jabatan", key: "jabatan" },
    {
      title: "Jenjang Jabatan",
      dataIndex: "jenjangJabatan",
      key: "jenjangJabatan",
    },
    { title: "Bagian", dataIndex: "bagian", key: "bagian" },
    { title: "Grade", dataIndex: "grade", key: "grade" },
    { title: "Unit Kerja", dataIndex: "unitKerja", key: "unitKerja" },
    { title: "Atasan", dataIndex: "atasan", key: "atasan" },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record, index) => (
        <Space>
          <Link to={`/users/edit/${record.uuid}`}>
            <Button type="primary" style={{ fontSize: "12px" }}>
              Edit
            </Button>
          </Link>

          <Button
            type="danger"
            onClick={() => deleteUser(record.uuid)}
            style={{ fontSize: "12px" }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const data = users.map((user, index) => ({
    key: user.uuid,
    index: index + 1,
    uuid: user.uuid,
    name: user.name,
    role: user.role,
    nip: user.nip,
    statusPegawai: user.statusPegawai,
    jabatan: user.jabatan,
    jenjangJabatan: user.jenjangJabatan,
    bagian: user.bagian,
    grade: user.grade,
    unitKerja: user.unitKerja,
    atasan: user.atasan,
  }));

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Users</h1>

      {/* Tombol untuk menambah user */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 20 }}
      >
        <Link to="/users/add">Add New User</Link>
      </Button>

      <Table
        className="custom-table"
        columns={columns}
        dataSource={data}
        size="small"
        pagination={false}
      />
    </div>
  );
};

export default Userlist;
