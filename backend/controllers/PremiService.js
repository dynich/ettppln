import Sequelize from 'sequelize';
import Users from "../models/UserModel.js";
import Premis from '../models/PremiModel.js';
import { Op } from 'sequelize';

export const aggregatePremisByUser = async (bulan, tahun) => {
    try {
        const monthPadded = bulan.padStart(2, '0'); // Pastikan bulan selalu dua digit
        const filterDate = `${tahun}-${monthPadded}`;
        const aggregatedData = await Premis.findAll({
            where: {
                tanggal: {
                    [Op.startsWith]: filterDate// Menyaring tanggal yang cocok dengan format YYYY-MM
                }
            },
            attributes: [
                'userId',
                [Sequelize.fn('SUM', Sequelize.col('bayarTTP1')), 'bayarTTP1'],
                [Sequelize.fn('SUM', Sequelize.col('total')), 'total'],
                'ttp1',
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
                    'tarifTTP1',
                    'tarifTTP1Maksimum',

                ]
            }]
        });

        return aggregatedData;
    } catch (error) {
        throw new Error('Error saat mengagregasi laporan: ' + error.message);
    }
};
