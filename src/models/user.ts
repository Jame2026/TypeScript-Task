import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import Database from "../config/db";

export interface UserRecord extends RowDataPacket {
    id: number;
    name: string;
    email: string;
}

class UserModel {
    constructor(
        public name: string,
        public email: string
    ) {}

    static async create(user: UserModel): Promise<ResultSetHeader> {
        const db = Database.getConnection();

        const [result] = await db.execute<ResultSetHeader>(
            "INSERT INTO users (name, email) values (?, ?)",[user.name, user.email]
        );
        return result;
    }

    static async deleteById(id: number): Promise<ResultSetHeader> {
        const db = Database.getConnection();

        const [result] = await db.execute<ResultSetHeader>("DELETE FROM users WHERE id = ?",
            [id]
        );
        return result;
    }

    static async updateById(id: number, user: UserModel): Promise<ResultSetHeader> {
        const db = Database.getConnection();

        const [result] = await db.execute<ResultSetHeader>(
            "UPDATE users SET name = ?, email = ? WHERE id = ?",
            [user.name, user.email, id]
        );

        return result;
    }

    static async findByName(name: string): Promise<UserRecord[]> {
        const db = Database.getConnection();

        const [rows] = await db.execute<UserRecord[]>(
            "SELECT * FROM users WHERE name LIKE ?",
            [`%${name}%`]
        );

        return rows;
    }

    static async findById(id: number): Promise<UserRecord | null> {
        const db = Database.getConnection();

        const [rows] = await db.execute<UserRecord[]>(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );

        return rows[0] ?? null;
    }

    static async getAll(): Promise<UserRecord[]> {
        const db = Database.getConnection();

        const [rows] = await db.execute<UserRecord[]>("SELECT * FROM users");

        return rows;
    }
}
export default UserModel;
