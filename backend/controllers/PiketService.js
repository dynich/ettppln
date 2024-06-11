import Sequelize from 'sequelize';
import Users from "../models/UserModel.js";
import Pikets from '../models/PiketModel.js';
import { Op } from 'sequelize';

export const aggregatePiketsByUser = async (bulan, tahun) => {
    try {
        const monthPadded = bulan.padStart(2, '0'); // Pastikan bulan selalu dua digit
        const filterDate = `${tahun}-${monthPadded}`;
        // Mengumpulkan dan mengagregasi laporan per pengguna
        const aggregatedData = await Pikets.findAll({
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
                [Sequelize.fn('SUM', Sequelize.col('jumlahHariSimbol1')), 'jumlahHariSimbol1'],
                [Sequelize.fn('SUM', Sequelize.col('jumlahHariSimbol2')), 'jumlahHariSimbol2'],
                [Sequelize.fn('SUM', Sequelize.col('jumlahHariSimbol3')), 'jumlahHariSimbol3'],
                [Sequelize.fn('SUM', Sequelize.col('bayarPiketKhusus')), 'bayarPiketKhusus'],
                [Sequelize.fn('SUM', Sequelize.col('bayarPiketRutin')), 'bayarPiketRutin'],
                'statusApproval',
                'admin1Approval',
                'admin2Approval',
                'superadminApproval'
            ],
            group: ['userId'],
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

        return aggregatedData;
    } catch (error) {
        throw new Error('Error saat mengagregasi laporan: ' + error.message);
    }
};
