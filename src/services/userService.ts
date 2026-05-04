import { ResultSetHeader } from "mysql2/promise";
import UserModel, { UserRecord } from "../models/user";

interface UserPayload {
    name: string;
    email: string;
}

class UserService {

    async getAll(): Promise<UserRecord[]> {
        return await UserModel.getAll();
    }

    async getById(idParam: string | undefined): Promise<UserRecord> {
        const id = this.parseId(idParam);
        const user = await UserModel.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    async searchByName(nameParam: string | undefined): Promise<UserRecord[]> {
        if (!nameParam) {
            throw new Error("Name is required");
        }

        return await UserModel.findByName(nameParam);
    }

    async create(payload: any): Promise<ResultSetHeader> {
        const user = this.validateUser(payload);
        return await UserModel.create(new UserModel(user.name, user.email));
    }

    async updateById(idParam: string | undefined, payload: any): Promise<ResultSetHeader> {
        const id = this.parseId(idParam);
        const user = this.validateUser(payload);

        const result = await UserModel.updateById(
            id,
            new UserModel(user.name, user.email)
        );

        if (result.affectedRows === 0) {
            throw new Error("User not found");
        }

        return result;
    }

    async deleteById(idParam: string | undefined): Promise<ResultSetHeader> {
        const id = this.parseId(idParam);

        const result = await UserModel.deleteById(id);

        if (result.affectedRows === 0) {
            throw new Error("User not found");
        }

        return result;
    }

    // ---------------- HELPER METHODS ----------------

    private parseId(idParam: string | undefined): number {
        const id = Number(idParam);

        if (!idParam || !Number.isInteger(id) || id <= 0) {
            throw new Error("Invalid user id");
        }

        return id;
    }

    private validateUser(payload: any): UserPayload {
        if (!payload || typeof payload !== "object") {
            throw new Error("Invalid data");
        }

        const { name, email } = payload;

        if (!name || typeof name !== "string") {
            throw new Error("Name is required");
        }

        if (!email || typeof email !== "string") {
            throw new Error("Email is required");
        }

        if (!this.isValidEmail(email)) {
            throw new Error("Invalid email");
        }

        return { name, email };
    }

    private isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

export default new UserService();