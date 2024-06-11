import Pikets from "../models/PiketModel.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";
import moment from "moment";

export const calculatePiket = (jenisPiket, jenisHari, jumlahHari) => {
    if (jenisPiket === "Piket Khusus") {
        return jumlahHari * 200000;
    } else if (jenisPiket === "Piket Rutin") {
        return (jenisHari === "Hari Kerja") ? jumlahHari * 75000 : jumlahHari * 100000;
    }
    return 0;
};

// PiketController.js

export const createPiket = async (req, res) => {
    
    try {
        const user = await Users.findByPk(req.userId);
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
        const { tanggal, jamMulai, jamSelesai, jenisPiket, jenisHari, pekerjaanLebih, statusApproval } = req.body;

        let bayarPiketKhusus = 0;
        let bayarPiketRutin = 0;
        let jumlahHariSimbol1 = 0;
        let jumlahHariSimbol2 = 0;
        let jumlahHariSimbol3 = 0;
        if (statusApproval === "Disetujui") {
            const jumlahHari = 1;
            // Hitung gaji piket menggunakan calculatePiket
            bayarPiketKhusus = calculatePiket(jenisPiket, jenisHari, jumlahHari);
            jumlahHariSimbol1 += jumlahHari;
            // Hitung gaji piket rutin menggunakan calculatePiket
            if (jenisPiket === "Rutin" && jenisHari === "Hari Kerja") {
                bayarPiketRutin = calculatePiket(jenisPiket, jenisHari, jumlahHari);
                jumlahHariSimbol2 += jumlahHari;
            } else if (jenisPiket === "Rutin" && jenisHari === "Hari Libur") {
                bayarPiketRutin = calculatePiket(jenisPiket, jenisHari, jumlahHari);
                jumlahHariSimbol3 += jumlahHari;
            }
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

        const piket = await Pikets.create({
            tanggal: moment(tanggal).format('YYYY-MM-DD'),
            jamMulai,
            jamSelesai,
            jenisPiket,
            jenisHari,
            pekerjaanLebih,
            jumlahHariSimbol1,
            jumlahHariSimbol2,
            jumlahHariSimbol3,
            userId: req.userId,
            grade: user.grade,
            atasan: user.atasan,
            skalaGajiDasar: user.skalaGajiDasar,
            bayarPiketKhusus,
            bayarPiketRutin,
            statusApproval,
            admin1Approval: admin1ApprovalValue,
            admin2Approval: admin2 ? "Menunggu" : null,
            superadminApproval: superadmin ? "Menunggu" : null,
        });

        res.status(201).json({ msg: "Piket Created Successfully", piket });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getPikets = async (req, res) => {
    try {
        let response;
        if (req.role === "admin1" || req.role === "user") {
            response = await Pikets.findAll({
                attributes: ['uuid', 'tanggal', 'jamMulai', 'jamSelesai', 'jenisPiket', 'jenisHari', 'pekerjaanLebih', 'statusApproval', 'bayarPiketKhusus', 'bayarPiketRutin'],
                where: {
                    userId: req.userId
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'nip', 'jabatan', 'jenjangjabatan', 'bagian', 'unitKerja', 'grade', 'atasan']
                }]
            });
        } else if (req.role === "superadmin") {
            response = await Pikets.findAll({
                attributes: ['uuid', 'tanggal', 'jamMulai', 'jamSelesai', 'jenisPiket', 'jenisHari', 'pekerjaanLebih', 'statusApproval', 'admin1Approval', 'admin2Approval', 'superadminApproval', 'bayarPiketKhusus', 'bayarPiketRutin'],
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'nip', 'jabatan', 'jenjangjabatan', 'bagian', 'unitKerja', 'grade', 'atasan']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const piket = await Pikets.findOne({
            where: {
                uuid: req.params.id,
            },
        });

        if (!piket) return res.status(404).json({ msg: "Data tidak ditemukan" });

        // Pengecekan level admin
        let approvalField;

        if (req.role === "admin1" && piket.admin1Approval === "Menunggu") {
            approvalField = "admin1Approval";
        } else if (req.role === "admin2" && piket.admin2Approval === "Menunggu") {
            approvalField = "admin2Approval";
        } else if (req.role === "superadmin" && piket.superadminApproval === "Menunggu") {
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
        piket[approvalField] = req.body.statusApproval;

        // Jika semua tahap persetujuan telah selesai, perbarui statusApproval menjadi "Disetujui" atau "Ditolak"
        if (piket.admin1Approval === "Disetujui" && piket.admin2Approval === "Disetujui" && piket.superadminApproval === "Disetujui") {
            piket.statusApproval = "Disetujui";

            // Hitung ulang gaji piket dan perbarui nilai-nilai yang diperlukan
            const jumlahHari = 1;
            if (piket.jenisPiket === "Piket Rutin" && piket.jenisHari === "Hari Kerja") {
                piket.bayarPiketRutin = calculatePiket(piket.jenisPiket, piket.jenisHari, jumlahHari);
                piket.jumlahHariSimbol2 = 1;
            } else if (piket.jenisPiket === "Piket Rutin" && (piket.jenisHari === "Hari Libur Bersama" || piket.jenisHari === "Hari Libur Nasional")) {
                piket.bayarPiketRutin = calculatePiket(piket.jenisPiket, piket.jenisHari, jumlahHari);
                piket.jumlahHariSimbol3 = 1;
            } else if (piket.jenisPiket === "Piket Khusus") {
                piket.bayarPiketKhusus = calculatePiket(piket.jenisPiket, piket.jenisHari, jumlahHari);
                piket.jumlahHariSimbol1 = 1;
            }
        }
        else if (piket.admin1Approval === "Ditolak" || piket.admin2Approval === "Ditolak" || piket.superadminApproval === "Ditolak") {
            piket.statusApproval = "Ditolak";
        } else {
            piket.statusApproval = "Menunggu";
        }

        await piket.save(); // Simpan perubahan

        res.status(200).json({ msg: "Status pengajuan piket diperbarui" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getApprovalPiket = async (req, res) => {
    try {
        let response;

        if (req.role === "admin1") {
            response = await Pikets.findAll({
                attributes: ['uuid', 'tanggal', 'jamMulai', 'jamSelesai', 'jenisPiket', 'jenisHari', 'pekerjaanLebih', 'statusApproval', 'bayarPiketKhusus', 'bayarPiketRutin', 'admin1Approval'],
                where: {
                    atasan: {
                        [Op.ne]: null, // Filter agar nilai atasan tidak null
                    },
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'nip', 'jabatan', 'jenjangjabatan', 'bagian', 'unitKerja', 'grade', 'atasan'],
                    where: {
                        atasan: req.name,
                    },
                }],
            });
        } else if (req.role === "admin2") {
            response = await Pikets.findAll({
                attributes: ['uuid', 'tanggal', 'jamMulai', 'jamSelesai', 'jenisPiket', 'jenisHari', 'pekerjaanLebih', 'statusApproval', 'bayarPiketKhusus', 'bayarPiketRutin', 'admin1Approval', 'admin2Approval'],
                where: {
                    [Op.or]: [
                        { admin1Approval: "Disetujui" },
                        { atasan: req.name },
                    ],
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'nip', 'jabatan', 'jenjangjabatan', 'bagian', 'unitKerja', 'grade', 'atasan'],

                }]
            });
        } else if (req.role === "superadmin") {
            response = await Pikets.findAll({
                attributes: ['uuid', 'tanggal', 'jamMulai', 'jamSelesai', 'jenisPiket', 'jenisHari', 'pekerjaanLebih', 'statusApproval', 'bayarPiketKhusus', 'bayarPiketRutin', 'admin1Approval', 'admin2Approval', 'superadminApproval'],
                where: {
                    [Op.or]: [
                        { admin1Approval: "Disetujui" },
                        { admin2Approval: "Disetujui" }
                    ],
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'nip', 'jabatan', 'jenjangjabatan', 'bagian', 'unitKerja', 'grade', 'atasan']
                }]
            });
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getApprovalPiketById = async (req, res) => {
    try {
        const piket = await Pikets.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!piket) return res.status(404).json({ msg: "Data tidak ditemukan" });

        // Pengecekan peran pengguna
        if (
            (req.role === "admin1") || (req.role === "admin2")
        ) {

            const response = {
                uuid: piket.uuid,
                tanggal: piket.tanggal,
                jamMulai: piket.jamMulai,
                jamSelesai: piket.jamSelesai,
                jenisPiket: piket.jenisPiket,
                jenisHari: piket.jenisHari,
                pekerjaanLebih: piket.pekerjaanLebih,
                statusApproval: piket.statusApproval,
                bayarPiketKhusus: piket.bayarPiketKhusus,
                bayarTTP2: piket.bayarTTP2,
                admin1Approval: piket.admin1Approval,
                admin2Approval: piket.admin2Approval,
                superadminApproval: piket.superadminApproval,
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


export const getPiketById = async (req, res) => {
    try {
        const piket = await Pikets.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!piket) return res.status(404).json({ msg: "Data tidak ditemukan" });
        let response;
        if (req.role === "admin1" || req.role === "user") {
            response = await Pikets.findOne({
                attributes: ['uuid', 'tanggal', 'jamMulai', 'jamSelesai', 'jenisPiket', 'jenisHari', 'pekerjaanLebih', 'statusApproval', 'bayarPiketKhusus', 'bayarPiketRutin'],
                where: {
                    [Op.and]: [{ id: piket.id }, { userId: req.userId }]
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'nip', 'jabatan', 'jenjangjabatan', 'bagian', 'unitKerja', 'grade', 'atasan']
                }]
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
  
      // Fetch all pending pikets
      const pendingPikets = await Pikets.findAll({
        where: {
          admin1Approval: {
            [Op.ne]: "Disetujui",
          },
        },
      });
  
      // Update each pending lembur to "Disetujui"
      for (const piket of pendingPikets) {
        await Pikets.update(
          { admin1Approval: "Disetujui" },
          { where: { uuid: piket.uuid } }
        );
      }
  
      res.status(200).json({ msg: "All pending approvals have been approved" });
    } catch (error) {
      console.error("Error in approveAllPending:", error);
      res.status(500).json({ msg: "Failed to approve all pending entries" });
    }
  };

export const updatePiket = async (req, res) => {
    try {
        const piket = await Pikets.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!piket) return res.status(404).json({ msg: "Data tidak ditemukan" });
        const { tanggal, jamMulai, jamSelesai, jenisPiket, jenisHari, pekerjaanLebih, statusApproval } = req.body;
        if (req.role === "admin1" || req.role === "admin2" || req.role === "superadmin") {
            await Pikets.update({ tanggal, jamMulai, jamSelesai, jenisPiket, jenisHari, pekerjaanLebih, statusApproval }, {
                where: {
                    id: piket.id
                }
            });
        } else {
            if (req.userId !== piket.userId) return res.status(403).json({ msg: "Akses terlarang" });
            await Pikets.update({ tanggal, jamMulai, jamSelesai, jenisPiket, jenisHari, pekerjaanLebih, statusApproval }, {
                where: {
                    [Op.and]: [{ id: piket.id }, { userId: req.userId }]
                }
            });
        }
        res.status(200).json({ msg: "Piket updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deletePiket = async (req, res) => {
    try {
        const piket = await Pikets.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!piket) return res.status(404).json({ msg: 'Data tidak ditemukan' });
        if (req.role === 'superadmin') {
            await Pikets.destroy({
                where: {
                    id: piket.id
                }
            });
        } else {
            if (req.userId !== piket.userId) return res.status(403).json({ msg: 'Akses terlarang' });
            await Pikets.destroy({
                where: {
                    [Op.and]: [{ id: piket.id }, { userId: req.userId }]
                }
            });
        }
        res.status(200).json({ msg: 'Premi deleted successfully' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
