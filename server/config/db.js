import mysql from "mysql2/promise.js";

let connection;

// Create a connection to the database
export const connectionToDB = async () => {
    if (!connection) {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });

        
    }

    return connection;
};
