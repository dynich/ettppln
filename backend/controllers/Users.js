import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
    try {
        const response = await Users.findAll({
            attributes: ['uuid', 'name', 'email', 'role','nip', 'tempatLahir', 'tanggalLahir', 'gender', 'statusPegawai', 'jabatan', 'jenjangJabatan', 'bagian', 'grade', 'unitKerja', 'atasan', 'konversiTingkatJabatan','skalaGajiDasar', 'tarifTTP2', 'tarifTTP2Maksimum', 'tarifTTP1', 'tarifTTP1Maksimum'],
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getUserById = async (req, res) => {
    try {
        const response = await Users.findOne({
            attributes: ['uuid', 'name', 'email', 'role','nip', 'tempatLahir', 'tanggalLahir', 'gender', 'statusPegawai', 'jabatan', 'jenjangJabatan', 'bagian', 'grade', 'unitKerja', 'atasan', 'konversiTingkatJabatan', 'skalaGajiDasar', 'tarifTTP2', 'tarifTTP2Maksimum', 'tarifTTP1', 'tarifTTP1Maksimum'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createUser = async (req, res) => {
    const { name, email, password, confPassword, role, nip, tempatLahir, tanggalLahir, gender, statusPegawai, jabatan, jenjangJabatan, bagian, grade, unitKerja, atasan, konversiTingkatJabatan,skalaGajiDasar, tarifTTP2, tarifTTP2Maksimum, tarifTTP1, tarifTTP1Maksimum } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
    const hashPassword = await argon2.hash(password);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role,
            nip: nip,
            tempatLahir: tempatLahir,
            tanggalLahir: tanggalLahir,
            gender: gender,
            statusPegawai: statusPegawai,
            jabatan: jabatan,
            jenjangJabatan: jenjangJabatan,
            bagian: bagian,
            grade: grade,
            unitKerja: unitKerja,
            atasan: atasan,
            konversiTingkatJabatan: konversiTingkatJabatan,
            skalaGajiDasar: skalaGajiDasar,
            tarifTTP2: tarifTTP2,
            tarifTTP2Maksimum: tarifTTP2Maksimum,
            tarifTTP1: tarifTTP1,
            tarifTTP1Maksimum: tarifTTP1Maksimum
        });
        res.status(201).json({ msg: "Register Berhasil" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const updateUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    });

    if (!user) {
        return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    const {
        name,
        email,
        password,
        confPassword,
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
    } = req.body;

    // Inisialisasi hashedPassword dengan password user saat ini
    let hashedPassword = user.password;

    if (password && confPassword) {
        // Jika password diisi, maka lakukan hashing jika password dan confPassword cocok
        if (password === confPassword) {
            hashedPassword = await argon2.hash(password);
        } else {
            return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
        }
    }

    try {
        await Users.update({
            name,
            email,
            password: hashedPassword,
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
        }, {
            where: {
                id: user.id
            }
        });

        res.status(200).json({ msg: "User Updated" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}


export const deleteUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    try {
        await Users.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({ msg: "User Deleted" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}