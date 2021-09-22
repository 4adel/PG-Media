import { Pool } from "pg";

let Conn =  new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.NODE_ENV === "production" ? true : false,
});
Conn.connect();

export default Conn;
