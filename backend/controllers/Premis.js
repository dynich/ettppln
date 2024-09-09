import Premis from '../models/PremiModel.js';
import Users from '../models/UserModel.js';
import { Op } from 'sequelize';
import moment from 'moment';

export const calculatePremi = (jumlahHari, user, premi) => {
    let koefisienPembeda = 1;
    let koefisienFungsi = 1;

    const total = jumlahHari * koefisienPembeda;
    const ttp1 = total * koefisienFungsi * user.tarifTTP1;
    const bayarTTP1 = ttp1 < user.tarifTTP1Maksimum ? ttp1 : user.tarifTTP1Maksimum;

    return {
        total,
        ttp1,
        bayarTTP1
    };
};

export const createPremi = async (req, res) => {
    
    try {
        const user = await Users.findByPk(req.userId);
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
        const { tanggal, jenisHari, jenisShift, pekerjaanLebih, statusApproval } = req.body;

        let total = 0;
        let ttp1 = 0;
        let bayarTTP1 = 0;
        let jumlahHari = 1; // Inisialisasi jumlahHari

        if (statusApproval === "Disetujui") {
            jumlahHari = 1; // Set jumlahHari menjadi 1
            const result = calculatePremi(jumlahHari, user);
            total = result.total;
            ttp1 = result.ttp1;
            bayarTTP1 = result.bayarTTP1;
        }
        const admin1 = await Users.findOne({ where: { role: "admin1" } });
        const admin2 = await Users.findOne({ where: { role: "admin2" } });
        const superadmin = await Users.findOne({ where: { role: "superadmin" } });

        let admin1ApprovalValue = admin1 ? "Menunggu" : null;
        if (req.role === "admin1") {
            // Jika admin2 yang membuat, set admin1Approval menjadi kosong
            admin1ApprovalValue = "Disetujui";
        }

        const premi = await Premis.create({
            tanggal: moment(tanggal).format('YYYY-MM-DD'),
            jenisHari,
            jenisShift,
            pekerjaanLebih,
            userId: req.userId,
            atasan: user.atasan,
            tarifTTP1: user.tarifTTP1,
            tarifTTP1Maksimum: user.tarifTTP1Maksimum,
            jumlahHari,
            total,
            ttp1,
            bayarTTP1,
            statusApproval,
            admin1Approval: admin1ApprovalValue,
            admin2Approval: admin2 ? "Menunggu" : null,
            superadminApproval: superadmin ? "Menunggu" : null,
        });
        res.status(201).json({ msg: 'Premi Created Successfully', premi });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getPremis = async (req, res) => {
    try {
        let response;
        if (req.role === "admin1" || req.role === "user") {
            response = await Premis.findAll({
                attributes: ['uuid', 'tanggal', 'jenisHari', 'jenisShift', 'pekerjaanLebih', 'statusApproval', 'total', 'ttp1', 'bayarTTP1'],
                where: {
                    userId: req.userId
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'nip', 'jabatan', 'jenjangjabatan', 'bagian', 'unitKerja', 'grade', 'atasan']
                }]
            });
        } else if (req.role === "superadmin") {
            response = await Premis.findAll({
                attributes: ['uuid', 'tanggal', 'jenisHari', 'jenisShift', 'pekerjaanLebih', 'statusApproval', 'admin1Approval', 'admin2Approval', 'superadminApproval', 'total', 'ttp1', 'bayarTTP1'],
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
        const premi = await Premis.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!premi) return res.status(404).json({ msg: "Data tidak ditemukan" });

        let approvalField;
        if (req.role === "admin1" && premi.admin1Approval === "Menunggu") {
            approvalField = "admin1Approval";
        } else if (req.role === "admin2" && premi.admin2Approval === "Menunggu") {
            approvalField = "admin2Approval";
        } else if (req.role === "superadmin" && premi.superadminApproval === "Menunggu") {
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
        premi[approvalField] = req.body.statusApproval;

        // Jika semua tahap persetujuan telah selesai, perbarui statusApproval menjadi "Disetujui" atau "Ditolak"
        if (premi.admin1Approval === "Disetujui" && premi.admin2Approval === "Disetujui" && premi.superadminApproval === "Disetujui") {
            premi.statusApproval = "Disetujui";

            // Hitung ulang premi dan perbarui nilai-nilai yang diperlukan
            const user = await Users.findByPk(premi.userId);
            const result = calculatePremi(premi.jumlahHari, user, premi);

            premi.total = result.total;
            premi.ttp1 = result.ttp1;
            premi.bayarTTP1 = result.bayarTTP1;
        } else if (premi.admin1Approval === "Ditolak" || premi.admin2Approval === "Ditolak" || premi.superadminApproval === "Ditolak") {
            premi.statusApproval = "Ditolak";
        } else {
            premi.statusApproval = "Menunggu";
        }

        await premi.save(); // Simpan perubahan

        res.status(200).json({ msg: "Status pengajuan premi diperbarui" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const getApprovalPremi = async (req, res) => {
    try {
        let response;

        if (req.role === "admin1") {
            response = await Premis.findAll({
                attributes: ['uuid', 'tanggal', 'jenisHari', 'jenisShift', 'pekerjaanLebih', 'statusApproval', 'total', 'ttp1', 'bayarTTP1', 'admin1Approval'],
                where: {
                    atasan: {
                        [Op.ne]: null, 
                    },
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'nip', 'jabatan', 'jenjangjabatan', 'bagian', 'unitKerja', 'grade', 'atasan'],
                    where: {
                        atasan: req.name,
                    },
                }]
            });
        } else if (req.role === "admin2") {
            response = await Premis.findAll({
                attributes: ['uuid', 'tanggal', 'jenisHari', 'jenisShift', 'pekerjaanLebih', 'statusApproval', 'total', 'ttp1', 'bayarTTP1', 'admin1Approval', 'admin2Approval'],
                where: {
                    [Op.or]: [
                        { admin1Approval: "Disetujui" },
                        { atasan: req.name },
                    ],
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'nip', 'jabatan', 'jenjangjabatan', 'bagian', 'unitKerja', 'grade', 'atasan']
                }]
            });
        } else if (req.role === "superadmin") {
            response = await Premis.findAll({
                attributes: ['uuid', 'tanggal', 'jenisHari', 'jenisShift', 'pekerjaanLebih', 'statusApproval', 'total', 'ttp1', 'bayarTTP1', 'admin1Approval', 'admin2Approval', 'superadminApproval'],
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

export const getApprovalPremiById = async (req, res) => {
    try {
        const premi = await Premis.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!premi) return res.status(404).json({ msg: "Data tidak ditemukan" });

        // Pengecekan peran pengguna
        if (
            (req.role === "admin1") || (req.role === "admin2")
        ) {
            // Di sini Anda dapat mengembalikan data premi yang dapat diubah oleh pengguna sesuai dengan peran dan status persetujuan.
            const response = {
                uuid: premi.uuid,
                tanggal: premi.tanggal,
                jenisHari: premi.jenisHari,
                jenisShift: premi.jenisShift,
                pekerjaanLebih: premi.pekerjaanLebih,
                statusApproval: premi.statusApproval,
                total: premi.total,
                ttp1: premi.ttp1,
                bayarTTP1: premi.bayarTTP1,
                admin1Approval: premi.admin1Approval,
                admin2Approval: premi.admin2Approval,
                superadminApproval: premi.superadminApproval,
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



export const getPremiById = async (req, res) => {
    try {
        const premi = await Premis.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!premi) return res.status(404).json({ msg: 'Data tidak ditemukan' });
        let response;
        if (req.role === "admin1" || req.role === "user") {
            response = await Premis.findOne({
                attributes: ['uuid', 'tanggal', 'jenisHari', 'jenisShift', 'pekerjaanLebih', 'statusApproval', 'total', 'ttp1', 'bayarTTP1'],
                where: {
                    [Op.and]: [
                        { id: premi.id }, // Laporan yang dibuat oleh bawahannya
                        { userId: req.userId }]
                },
                
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'nip', 'jabatan', 'jenjangjabatan', 'bagian', 'unitkerja', 'grade', 'atasan']
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
      if (req.role !== "admin1" && req.role !== "admin2") {
        return res.status(403).json({ msg: "Akses terlarang" });
      }
  
      // Fetch all pending premis
      const whereCondition =
        req.role === "admin1"
          ? { admin1Approval: { [Op.ne]: "Disetujui" } }
          : {
              admin1Approval: "Disetujui",
              admin2Approval: { [Op.ne]: "Disetujui" },
            };

      const pendingPremis = await Premis.findAll({
        where: whereCondition,
      });

      // Update each pending premi to "Disetujui"
      for (const premi of pendingPremis) {
        if (req.role === "admin1") {
          await Premis.update(
            { admin1Approval: "Disetujui" },
            { where: { uuid: premi.uuid } }
          );
        } else if (req.role === "admin2") {
          await Premis.update(
            { admin2Approval: "Disetujui" },
            { where: { uuid: premi.uuid } }
          );
        }
      }
  
      res.status(200).json({ msg: "All pending approvals have been approved" });
    } catch (error) {
      console.error("Error in approveAllPending:", error);
      res.status(500).json({ msg: "Failed to approve all pending entries" });
    }
  };

export const updatePremi = async (req, res) => {
    try {
        const premi = await Premis.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!premi) return res.status(404).json({ msg: 'Data tidak ditemukan' });
        const { tanggal, jenisHari, jenisShift, pekerjaanLebih, statusApproval } = req.body;
        if (req.role === "admin1" || req.role === "admin2" || req.role === "superadmin") {
            await Premis.update({ tanggal, jenisHari, jenisHari, pekerjaanLebih, statusApproval }, {
                where: {
                    id: premi.id
                }
            });
        } else {
            if (req.userId !== premi.userId) return res.status(403).json({ msg: "Akses terlarang" });
            await Premis.update({ tanggal, jenisHari, jenisShift, pekerjaanLebih, statusApproval }, {
                where: {
                    [Op.and]: [{ id: premi.id }, { userId: req.userId }]
                }
            });
        }
        res.status(200).json({ msg: "Lembur updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deletePremi = async (req, res) => {
    try {
        const premi = await Premis.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!premi) return res.status(404).json({ msg: 'Data tidak ditemukan' });
        if (req.role === 'superadmin') {
            await Premis.destroy({
                where: {
                    id: premi.id
                }
            });
        } else {
            if (req.userId !== premi.userId) return res.status(403).json({ msg: 'Akses terlarang' });
            await Premis.destroy({
                where: {
                    [Op.and]: [{ id: premi.id }, { userId: req.userId }]
                }
            });
        }
        res.status(200).json({ msg: 'Premi deleted successfully' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
