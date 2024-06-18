// PiketModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Pikets = db.define('pikets', {
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
    jamMulai: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    jamSelesai: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    jenisPiket: {
        type: DataTypes.STRING,
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
    pekerjaanLebih: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    buktiPiket: {
        type: DataTypes.BLOB,
        allowNull: true,
    },
    jumlahHariSimbol1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    jumlahHariSimbol2: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    jumlahHariSimbol3: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    
    atasan: {
        type: DataTypes.STRING,
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
    bayarPiketKhusus: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    bayarPiketRutin: {
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

Users.hasMany(Pikets);
Pikets.belongsTo(Users, { foreignKey: 'userId' });

export default Pikets;
