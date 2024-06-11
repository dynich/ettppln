import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Users from './UserModel.js';

const { DataTypes } = Sequelize;

const Premis = db.define('Premis', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    tanggal: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    jenisHari: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    jenisShift: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    pekerjaanLebih: {
        type: DataTypes.STRING,
        allowNull: true
    },
    jumlahHari: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    statusApproval: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        defaultValue: 'Menunggu', // Default status
    },
    atasan: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    total: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    tarifTTP1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    ttp1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    tarifTTP1Maksimum: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    bayarTTP1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    admin1Approval: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: true
        },
        defaultValue: null
    },
    admin2Approval: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: true
        },
        defaultValue: null
    },
    superadminApproval: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: true
        },
        defaultValue: null
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true,
});

Users.hasMany(Premis);
Premis.belongsTo(Users, { foreignKey: 'userId' });

export default Premis;
