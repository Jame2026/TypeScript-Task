import mysql, { Pool } from "mysql2/promise";

class Database {
  private static connection: Pool;

  public static async connect(): Promise<Pool> {
    if (!this.connection) {
      const pool = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_ts",
        waitForConnections: true,
        connectionLimit: 10
      });

      const connection = await pool.getConnection();
      connection.release();

      this.connection = pool;
      console.log("MySQL connected successfully");
    }

    return this.connection;
  }

  public static getConnection(): Pool {
    if (!this.connection) {
      throw new Error("Database not initialized. Call connect() first.");
    }
    return this.connection;
  }
}

export default Database;
