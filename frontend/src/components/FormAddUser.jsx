import React from 'react';
import axios from 'axios';
import { Form, Input, Button, Select, DatePicker, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';

const FormAddUser = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const adaptedValues = {
        ...values,
        tanggalLahir: values.tanggalLahir.format('YYYY-MM-DD'),
      };
      await axios.post("http://localhost:5000/users", adaptedValues);
      message.success('User added successfully');
      navigate('/users');
    } catch (error) {
      message.error(error.response?.data?.msg || 'Failed to add user');
    }
  };

  return (
    <div>
      <h1>Add New User</h1>
      <Form layout="vertical" onFinish={onFinish}>
        <Button type="primary" htmlType="submit">Save</Button>
        <Row gutter={16}>
          {/* First Column */}
          <Col span={12}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="user">User</Select.Option>
                <Select.Option value="admin1">Admin 1</Select.Option>
                <Select.Option value="admin2">Admin 2</Select.Option>
                <Select.Option value="superadmin">Super Admin</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="nip" label="NIP" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="tempatLahir" label="Tempat Lahir" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="tanggalLahir" label="Tanggal Lahir" rules={[{ required: true }]}>
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="male">Laki-Laki</Select.Option>
                <Select.Option value="female">Perempuan</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="statusPegawai" label="Status Pegawai" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="jabatan" label="Jabatan" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="jenjangJabatan" label="Jenjang Jabatan" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="bagian" label="Bagian" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          {/* Second Column */}
          <Col span={12}>
            <Form.Item name="grade" label="Grade" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="unitKerja" label="Unit Kerja" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="confPassword" label="Konfirmasi Password" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item name="atasan" label="Atasan" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="konversiTingkatJabatan" label="Konversi Tingkat Jabatan" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="skalaGajiDasar" label="Skala Gaji Dasar" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="tarifTTP2" label="Tarif TTP2" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="tarifTTP2Maksimum" label="Tarif TTP2 Maksimum" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="tarifTTP1" label="Tarif TTP1" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="tarifTTP1Maksimum" label="Tarif TTP1 Maksimum" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </div>
  );
};

export default FormAddUser;
