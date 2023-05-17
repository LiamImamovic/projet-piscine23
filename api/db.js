import mysql from "mysql"

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "blog_refresh",
    port: 8889
});

export { db };