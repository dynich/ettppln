import Users from "../models/UserModel.js";
import Premis from '../models/PremiModel.js';
import { Op } from 'sequelize';

export const getAllPremis = async (bulan, tahun) => {
    try {
        const monthPadded = bulan.padStart(2, '0'); // Pastikan bulan selalu dua digit
        const filterDate = `${tahun}-${monthPadded}`;
        const filteredPremis = await Premis.findAll({
            where: {
                tanggal: {
                    [Op.startsWith]: filterDate// Menyaring tanggal yang cocok dengan format YYYY-MM
                }
            },
            attributes: [
                'userId',
                'bayarTTP1',
                'total',
                'ttp1',
                'statusApproval',
                'admin1Approval',
                'admin2Approval',
                'superadminApproval'
            ],
            include: [{
                model: Users,
                attributes: [
                    'name',
                    'email',
                    'nip',
                    'jabatan',
                    'jenjangJabatan',
                    'grade',
                    'atasan',
                    'skalaGajiDasar',
                    'tarifTTP1',
                    'tarifTTP1Maksimum',
                ]
            }]
        });

        return filteredPremis;
    } catch (error) {
        throw new Error('Error saat mengambil semua laporan: ' + error.message);
    }
};