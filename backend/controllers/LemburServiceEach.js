import Users from "../models/UserModel.js";
import Lemburs from '../models/LemburModel.js';
import { Op } from 'sequelize';

export const getAllLemburs = async (bulan, tahun) => {
    try {
        const monthPadded = bulan.padStart(2, '0'); // Pastikan bulan selalu dua digit
        const filterDate = `${tahun}-${monthPadded}`; 
        const filteredLemburs = await Lemburs.findAll({
            where: {
                tanggal: {
                    [Op.startsWith]: filterDate// Menyaring tanggal yang cocok dengan format YYYY-MM
                }
            },
            attributes: [
                'userId',
                'tanggal',
                'jamMulai',
                'jamSelesai',
                'bayarTTP2',
                'total',
                'ttp2',
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
                    'tarifTTP2',
                    'tarifTTP2Maksimum',
                ]
            }]
        });

        return filteredLemburs;
    } catch (error) {
        throw new Error('Error saat mengambil semua laporan: ' + error.message);
    }
};