import Lemburs from "../models/LemburModel.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";
// import upload from "../middlewares/upload.js";
import moment from "moment";

export const calculateLembur = (jamMulai, jamSelesai, jenisHari, user) => {
  const start = moment(jamMulai, "HH:mm");
  const end = moment(jamSelesai, "HH:mm");
  const jumlahJamLembur = end.diff(start, "hours", true);

  let koefisienPembeda;
  switch (jenisHari) {
    case "Hari Kerja":
      koefisienPembeda =
        jumlahJamLembur > 1 ? [1 * 1.5, (jumlahJamLembur - 1) * 2] : [1];
      break;
    case "Hari Libur Bersama":
      koefisienPembeda = [3 * jumlahJamLembur];
      break;
    case "Hari Libur Nasional":
      koefisienPembeda = [4 * jumlahJamLembur];
      break;
    default:
      koefisienPembeda = [1];
  }

  const total = koefisienPembeda.reduce((acc, koef) => acc + koef, 0);
  const ttp2 = total * user.tarifTTP2;
  const bayarTTP2 =
    ttp2 < user.tarifTTP2Maksimum ? ttp2 : user.tarifTTP2Maksimum;

  return {
    jumlahJamLembur,
    koefisienPembeda,
    total,
    ttp2,
    bayarTTP2,
  };
};

export const createLembur = async (req, res) => {
  try {
    const user = await Users.findByPk(req.userId);
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    const {
      tanggal,
      jamMulai,
      jamSelesai,
      jenisHari,
      pekerjaanLebih,
      statusApproval,
      buktiLembur = req.file ? `..uploads/${req.file.filename}` : null,
    } = req.body;

    console.log(req.body)

    let jumlahJamLembur = 0;
    let total = 0;
    let ttp2 = 0;
    let bayarTTP2 = 0;

    if (statusApproval === "Disetujui") {
      const result = calculateLembur(jamMulai, jamSelesai, jenisHari, user);
      jumlahJamLembur = result.jumlahJamLembur;
      total = result.total;
      ttp2 = result.ttp2;
      bayarTTP2 = result.bayarTTP2;
    }

    // Tambahkan level approval berdasarkan atasan
    const admin1 = await Users.findOne({ where: { role: "admin1" } });
    const admin2 = await Users.findOne({ where: { role: "admin2" } });
    const superadmin = await Users.findOne({ where: { role: "superadmin" } });

    let admin1ApprovalValue = admin1 ? "Menunggu" : null;
    if (req.role === "admin1") {
      // Jika admin2 yang membuat, set admin1Approval menjadi kosong
      admin1ApprovalValue = "Disetujui";
    }

    // const buktiLembur = req.file ? `/uploads/${req.file.filename}` : null;

    const lembur = await Lemburs.create({
      tanggal: moment(tanggal).format("YYYY-MM-DD"),
      jamMulai,
      jamSelesai,
      jenisHari,
      pekerjaanLebih,
      userId: req.userId,
      grade: user.grade,
      atasan: user.atasan,
      skalaGajiDasar: user.skalaGajiDasar,
      tarifTTP2: user.tarifTTP2,
      tarifTTP2Maksimum: user.tarifTTP2Maksimum,
      jumlahJamLembur,
      total,
      ttp2,
      bayarTTP2,
      statusApproval,
      admin1Approval: admin1ApprovalValue,
      admin2Approval: admin2 ? "Menunggu" : null,
      superadminApproval: superadmin ? "Menunggu" : null,
      buktiLembur,
    });

    res.status(201).json({ msg: "Lembur Created Successfully", lembur });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getLemburs = async (req, res) => {
  try {
    let response;
    if (req.role === "admin1" || req.role === "user") {
      response = await Lemburs.findAll({
        attributes: [
          "uuid",
          "tanggal",
          "jamMulai",
          "jamSelesai",
          "jumlahJamLembur",
          "jenisHari",
          "pekerjaanLebih",
          "statusApproval",
          "total",
          "ttp2",
          "bayarTTP2",
          "buktiLembur",
        ],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: Users,
            attributes: [
              "name",
              "email",
              "nip",
              "jabatan",
              "jenjangjabatan",
              "bagian",
              "unitKerja",
              "grade",
              "atasan",
            ],
          },
        ],
      });
    } else if (req.role === "superadmin") {
      response = await Lemburs.findAll({
        attributes: [
          "uuid",
          "tanggal",
          "jamMulai",
          "jamSelesai",
          "jumlahJamLembur",
          "jenisHari",
          "pekerjaanLebih",
          "statusApproval",
          "admin1Approval",
          "admin2Approval",
          "superadminApproval",
          "total",
          "ttp2",
          "bayarTTP2",
          "buktiLembur",
        ],
        include: [
          {
            model: Users,
            attributes: [
              "name",
              "email",
              "nip",
              "jabatan",
              "jenjangjabatan",
              "bagian",
              "unitKerja",
              "grade",
              "atasan",
            ],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const lembur = await Lemburs.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!lembur) return res.status(404).json({ msg: "Data tidak ditemukan" });

    // Pengecekan level admin
    let approvalField;
    if (req.role === "admin1" && lembur.admin1Approval === "Menunggu") {
      approvalField = "admin1Approval";
    } else if (req.role === "admin2" && lembur.admin2Approval === "Menunggu") {
      approvalField = "admin2Approval";
    } else if (
      req.role === "superadmin" &&
      lembur.superadminApproval === "Menunggu"
    ) {
      approvalField = "superadminApproval";
    } else {
      return res.status(403).json({ msg: "Akses terlarang" });
    }

    // Validasi status
    const validStatus = ["Menunggu", "Disetujui", "Ditolak"];
    if (!validStatus.includes(req.body.statusApproval)) {
      return res.status(400).json({ msg: "Status tidak valid" });
    }

    // Update status approval sesuai dengan role
    lembur[approvalField] = req.body.statusApproval;

    // Jika semua tahap persetujuan telah selesai, perbarui statusApproval menjadi "Disetujui" atau "Ditolak"
    if (
      lembur.admin1Approval === "Disetujui" &&
      lembur.admin2Approval === "Disetujui" &&
      lembur.superadminApproval === "Disetujui"
    ) {
      lembur.statusApproval = "Disetujui";

      // Hitung ulang lembur dan perbarui nilai-nilai yang diperlukan
      const user = await Users.findByPk(lembur.userId);
      const result = calculateLembur(
        lembur.jamMulai,
        lembur.jamSelesai,
        lembur.jenisHari,
        user,
        lembur
      );

      // Perbarui nilai-nilai lembur
      lembur.jumlahJamLembur = result.jumlahJamLembur;
      lembur.koefisienPembeda = result.koefisienPembeda;
      lembur.total = result.total;
      lembur.ttp2 = result.ttp2;
      lembur.bayarTTP2 = result.bayarTTP2;
    } else if (
      lembur.admin1Approval === "Ditolak" ||
      lembur.admin2Approval === "Ditolak" ||
      lembur.superadminApproval === "Ditolak"
    ) {
      lembur.statusApproval = "Ditolak";
    } else {
      lembur.statusApproval = "Menunggu";
    }

    await lembur.save(); // Simpan perubahan

    res.status(200).json({ msg: "Status pengajuan lembur diperbarui" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getApprovalLembur = async (req, res) => {
  try {
    let response;

    if (req.role === "admin1") {
      response = await Lemburs.findAll({
        attributes: [
          "uuid",
          "tanggal",
          "jamMulai",
          "jamSelesai",
          "jenisHari",
          "pekerjaanLebih",
          "statusApproval",
          "total",
          "ttp2",
          "bayarTTP2",
          "admin1Approval",
          "buktiLembur",
        ],
        where: {
          atasan: {
            [Op.ne]: null, // Filter agar nilai atasan tidak null
          },
        },
        include: [
          {
            model: Users,
            attributes: [
              "name",
              "email",
              "nip",
              "jabatan",
              "jenjangjabatan",
              "bagian",
              "unitKerja",
              "grade",
              "atasan",
            ],
            where: {
              atasan: req.name,
            },
          },
        ],
      });
    } else if (req.role === "admin2") {
      response = await Lemburs.findAll({
        attributes: [
          "uuid",
          "tanggal",
          "jamMulai",
          "jamSelesai",
          "jenisHari",
          "pekerjaanLebih",
          "statusApproval",
          "total",
          "ttp2",
          "bayarTTP2",
          "admin1Approval",
          "admin2Approval",
          "buktiLembur",
        ],
        where: {
          [Op.or]: [{ admin1Approval: "Disetujui" }, { atasan: req.name }],
        },
        include: [
          {
            model: Users,
            attributes: [
              "name",
              "email",
              "nip",
              "jabatan",
              "jenjangjabatan",
              "bagian",
              "unitKerja",
              "grade",
              "atasan",
            ],
          },
        ],
      });
    } else if (req.role === "superadmin") {
      response = await Lemburs.findAll({
        attributes: [
          "uuid",
          "tanggal",
          "jamMulai",
          "jamSelesai",
          "jenisHari",
          "pekerjaanLebih",
          "statusApproval",
          "total",
          "ttp2",
          "bayarTTP2",
          "admin1Approval",
          "admin2Approval",
          "superadminApproval",
          "buktiLembur",
        ],
        where: {
          [Op.or]: [
            { admin1Approval: "Disetujui" },
            { admin2Approval: "Disetujui" },
          ],
        },
        include: [
          {
            model: Users,
            attributes: [
              "name",
              "email",
              "nip",
              "jabatan",
              "jenjangjabatan",
              "bagian",
              "unitKerja",
              "grade",
              "atasan",
            ],
          },
        ],
      });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getApprovalLemburById = async (req, res) => {
  try {
    const lembur = await Lemburs.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!lembur) return res.status(404).json({ msg: "Data tidak ditemukan" });

    // Pengecekan peran pengguna
    if (req.role === "admin1" || req.role === "admin2") {
      // Di sini Anda dapat mengembalikan data lembur yang dapat diubah oleh pengguna sesuai dengan peran dan status persetujuan.
      const response = {
        uuid: lembur.uuid,
        tanggal: lembur.tanggal,
        jamMulai: lembur.jamMulai,
        jamSelesai: lembur.jamSelesai,
        jenisHari: lembur.jenisHari,
        pekerjaanLebih: lembur.pekerjaanLebih,
        statusApproval: lembur.statusApproval,
        total: lembur.total,
        ttp2: lembur.ttp2,
        bayarTTP2: lembur.bayarTTP2,
        admin1Approval: lembur.admin1Approval,
        admin2Approval: lembur.admin2Approval,
        superadminApproval: lembur.superadminApproval,
        buktiLembur: lembur.buktiLembur,
        // tambahkan atribut lain yang diperlukan
      };

      res.status(200).json(response);
    } else {
      res.status(403).json({ msg: "Akses terlarang" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getLemburById = async (req, res) => {
  try {
    const lembur = await Lemburs.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!lembur) return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin1" || req.role === "user") {
      response = await Lemburs.findOne({
        attributes: [
          "uuid",
          "tanggal",
          "jamMulai",
          "jamSelesai",
          "jumlahJamLembur",
          "jenisHari",
          "pekerjaanLebih",
          "statusApproval",
          "total",
          "ttp2",
          "bayarTTP2",
          "buktiLembur",
        ], // Menambah atribut total, tpp2, dan bayarTTP2
        where: {
          [Op.and]: [{ id: lembur.id }, { userId: req.userId }],
        },
        include: [
          {
            model: Users,
            attributes: [
              "name",
              "email",
              "nip",
              "jabatan",
              "jenjangjabatan",
              "bagian",
              "unitKerja",
              "grade",
              "atasan",
            ],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const approveAllPending = async (req, res) => {
  try {
    // Check if the user is admin1
    if (req.role !== "admin1") {
      return res.status(403).json({ msg: "Akses terlarang" });
    }

    // Fetch all pending lemburs
    const pendingLemburs = await Lemburs.findAll({
      where: {
        admin1Approval: {
          [Op.ne]: "Disetujui",
        },
      },
    });

    // Update each pending lembur to "Disetujui"
    for (const lembur of pendingLemburs) {
      await Lemburs.update(
        { admin1Approval: "Disetujui" },
        { where: { uuid: lembur.uuid } }
      );
    }

    res.status(200).json({ msg: "All pending approvals have been approved" });
  } catch (error) {
    console.error("Error in approveAllPending:", error);
    res.status(500).json({ msg: "Failed to approve all pending entries" });
  }
};

export const updateLembur = async (req, res) => {
  try {
    const lembur = await Lemburs.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!lembur) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const {
      tanggal,
      jamMulai,
      jamSelesai,
      jenisHari,
      pekerjaanLebih,
      statusApproval,
    } = req.body;
    if (
      req.role === "admin1" ||
      req.role === "admin2" ||
      req.role === "superadmin"
    ) {
      await Lemburs.update(
        {
          tanggal,
          jamMulai,
          jamSelesai,
          jenisHari,
          pekerjaanLebih,
          statusApproval,
        },
        {
          where: {
            id: lembur.id,
          },
        }
      );
    } else {
      if (req.userId !== lembur.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Lemburs.update(
        {
          tanggal,
          jamMulai,
          jamSelesai,
          jenisHari,
          pekerjaanLebih,
          statusApproval,
        },
        {
          where: {
            [Op.and]: [{ id: lembur.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Lembur updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteLembur = async (req, res) => {
  try {
    const lembur = await Lemburs.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!lembur) return res.status(404).json({ msg: "Data tidak ditemukan" });
    if (req.role === "superadmin") {
      await Lemburs.destroy({
        where: {
          id: lembur.id,
        },
      });
    } else {
      if (req.userId !== lembur.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Lemburs.destroy({
        where: {
          [Op.and]: [{ id: lembur.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Lembur deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
