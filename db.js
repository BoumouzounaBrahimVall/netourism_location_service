
const Pool = require("pg").Pool;
const pool = new Pool({
user: "ilisi",
password: "ilisi",
host: "localhost",
port: "15432",
database: "netourism"
});
module.exports = pool;