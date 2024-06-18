import { Sequelize } from "sequelize";

const db = new Sequelize("cobaettpln", "root", "", {
  host: "localhost",
  dialect: "mysql",
  timezone: "Asia/Makassar",
  // port: 3306,
});

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


export default db;