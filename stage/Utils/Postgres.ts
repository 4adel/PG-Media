import { Pool } from "pg";

class DB {
  static db: any;
  static async connect() {
    if (this.db) return this.db;
    return new Promise(async (resolve: Function, reject: Function) => {
      try {
        let Conn = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.NODE_ENV === "production" ? true : false,
        });
        await Conn.connect();
        this.db = Conn;
        resolve();
        return this.db;
      } catch (Error: any) {
        reject(Error);
      }
    });
  }
}

export default DB;
