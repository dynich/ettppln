import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        const match = await argon2.verify(user.password, req.body.password);
        if (!match) {
            return res.status(400).json({ msg: "Password salah" });
        }

        req.session.userId = user.uuid;

        const {
            uuid,
            name,
            email,
            role,
            nip,
            tempatLahir,
            tanggalLahir,
            gender,
            statusPegawai,
            jabatan,
            jenjangJabatan,
            bagian,
            grade,
            unitKerja,
            atasan,
            konversiTingkatJabatan,
            skalaGajiDasar,
            tarifTTP2,
            tarifTTP2Maksimum,
            tarifTTP1,
            tarifTTP1Maksimum
        } = user;

        res.status(200).json({
            uuid,
            name,
            email,
            role,
            nip,
            tempatLahir,
            tanggalLahir,
            gender,
            statusPegawai,
            jabatan,
            jenjangJabatan,
            bagian,
            grade,
            unitKerja,
            atasan,
            konversiTingkatJabatan,
            skalaGajiDasar,
            tarifTTP2,
            tarifTTP2Maksimum,
            tarifTTP1,
            tarifTTP1Maksimum
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};

export const Me = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
        }

        const user = await Users.findOne({
            attributes: [
                'uuid',
                'name',
                'email',
                'role',
                'nip',
                'tempatLahir',
                'tanggalLahir',
                'gender',
                'statusPegawai',
                'jabatan',
                'jenjangJabatan',
                'bagian',
                'grade',
                'unitKerja',
                'atasan',
                'konversiTingkatJabatan',
                'skalaGajiDasar',
                'tarifTTP2',
                'tarifTTP2Maksimum',
                'tarifTTP1',
                'tarifTTP1Maksimum'
            ],
            where: {
                uuid: req.session.userId
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};

export const LogOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(400).json({ msg: "Tidak dapat logout" });
        }
        res.status(200).json({ msg: "Anda telah logout" });
    });
};
