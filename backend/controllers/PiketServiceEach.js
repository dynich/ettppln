import Users from "../models/UserModel.js";
import Pikets from '../models/PiketModel.js';
import { Op } from 'sequelize';

export const getAllPikets = async (bulan, tahun) => {
    try {
        const monthPadded = bulan.padStart(2, '0'); // Pastikan bulan selalu dua digit
        const filterDate = `${tahun}-${monthPadded}`; 
        const filteredPikets = await Pikets.findAll({
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
                'bayarPiketKhusus',
                'bayarPiketRutin',
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
                ]
            }]
        });

        return filteredPikets;
    } catch (error) {
        throw new Error('Error saat mengambil semua laporan: ' + error.message);
    }
};