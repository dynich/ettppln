import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { message } from "antd";
import { Modal } from "antd";

const FormEditUser = () => {
  const user = useSelector((state) => state.auth.user);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confPassword: "",
    role: "",
    nip: "",
    tempatLahir: "",
    tanggalLahir: "",
    gender: "",
    statusPegawai: "",
    jabatan: "",
    jenjangJabatan: "",
    bagian: "",
    grade: "",
    unitKerja: "",
    atasan: "",
    konversiTingkatJabatan: "",
    skalaGajiDasar: "",
    tarifTTP2: "",
    tarifTTP2Maksimum: "",
    tarifTTP1: "",
    tarifTTP1Maksimum: "",
  });
  const [msg, setMsg] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Daftar atribut yang ingin Anda tampilkan dalam form untuk peran superadmin
  const superadminAttributes = [
    "name",
    "email",
    "password",
    "confPassword",
    "role",
    "nip",
    "tempatLahir",
    "tanggalLahir",
    "gender",
    "statusPegawai",
    "jabatan",
    "jenjangJabatan",
    "bagian",
    "grade",
    "unitKerja",
    "atasan",
    "konversiTingkatJabatan",
    "skalaGajiDasar",
    "tarifTTP2",
    "tarifTTP2Maksimum",
    "tarifTTP1",
    "tarifTTP1Maksimum",
  ];

  // Daftar atribut yang ingin Anda tampilkan dalam form untuk peran admin1 dan admin2
  const adminAttributes = [
    "name",
    "email",
    "password",
    "confPassword",
    "nip",
    "jabatan",
    "grade",
    "atasan",
    "bagian",
    "unitKerja",
  ];

  // Daftar atribut yang ingin Anda tampilkan dalam form untuk peran selain superadmin, admin1 dan admin2
  const otherAttributes = ["password", "confPassword"];

  let editableAttributes;
  if (user.role === "superadmin") {
    editableAttributes = superadminAttributes;
  } else if (user.role === "admin1" || user.role === "admin2") {
    editableAttributes = adminAttributes;
  } else {
    editableAttributes = otherAttributes;
  }

  useEffect(() => {
    const getUserById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${id}`);
        setUserData(response.data);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getUserById();
  }, [id]);

  const handleInputChange = (key, value) => {
    setUserData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleUpdateUser = async () => {
    try {
      await axios.patch(`http://localhost:5000/users/${id}`, userData);
      setIsModalVisible(false); // Menutup modal
      if (user.role === "superadmin") {
        navigate("/users");
      } else {
        navigate("/datapegawai");
      }
      message.success("User berhasil diupdate"); // Menampilkan notifikasi sukses
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  const showConfirmModal = () => {
    setIsModalVisible(true); // Menampilkan modal konfirmasi
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Menutup modal konfirmasi
  };

  return (
    <div>
      <h2
        className="title"
        style={{
          fontSize: "24px",
          marginBottom: "20px",
          color: "black",
          fontWeight: "bold",
        }}
      >
        Data Pegawai
      </h2>
      <h3
        className="judul_font informasi_pribadi"
        style={{ color: "#168FF0", marginTop: "40px" }}
      >
        Update User
      </h3>
      <p
        style={{
          fontSize: "18px",
          fontStyle: "italic",
          fontWeight: "300",
          padding: "10px 0px 0px 22px",
        }}
      >
        Silakan lengkapi formulir di bawah untuk memperbarui informasi biodata
        Anda!
      </p>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={(e) => e.preventDefault()}>
              <p className="has-text-centered">{msg}</p>
              {userData &&
                editableAttributes.map((attribute) => (
                  <div className="field" key={attribute}>
                    <label className="label">{attribute}</label>
                    <div className="control">
                      <input
                        className="input"
                        type={
                          attribute === "password" ||
                          attribute === "confPassword"
                            ? "password"
                            : "text"
                        }
                        value={userData[attribute] || ""}
                        onChange={(e) =>
                          handleInputChange(attribute, e.target.value)
                        }
                        placeholder={attribute}
                      />
                    </div>
                  </div>
                ))}
              <div className="field">
                <div className="control">
                  <button
                    type="button"
                    className="button is-success"
                    onClick={showConfirmModal}
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal konfirmasi */}
      <Modal
        title="Konfirmasi"
        visible={isModalVisible}
        onOk={handleUpdateUser}
        onCancel={handleCancel}
        okText="Update"
        cancelText="Batal"
      >
        <p>Apakah Anda yakin ingin mengupdate user?</p>
      </Modal>
    </div>
  );
};

export default FormEditUser;
