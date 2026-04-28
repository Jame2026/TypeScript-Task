import {Request, Response} from "express";
import UserModel from "../models/user";

class UserController {
    private static getSingleParam(value: string | string[] | undefined): string | null {
        return typeof value === "string" ? value.trim() : null;
    }

    static async getAll(_req: Request, res: Response): Promise<void> {
        try{
            const users = await UserModel.getAll();

            res.json({
                count: users.length,
                data: users
            });
        }catch (error){
            res.status(500).json({
                message: "Error fetching users"
            });
        }
    }



    static async create(req: Request, res: Response): Promise<void> {
        try{
            const {name, email} = req.body;

            if (typeof name !== "string" || typeof email !== "string") {
                res.status(400).json({
                    message: "name and email are required."
                });
                return;
            }

            const newUser = new UserModel(name.trim(), email.trim());

            const result = await UserModel.create(newUser);

            res.status(201).json({
                message: "User created successfully.",
                data: {
                    affectedRows: result.affectedRows,
                    insertId: result.insertId
                }
            });
        }catch (err){
            res.status(500).json({
                message: `Error creating user`
            });
        }
    }

    static async searchByName(req: Request, res: Response): Promise<void> {
        try{
            const searchName = this.getSingleParam(req.params.name);

            if (!searchName) {
                res.status(400).json({
                    message: "A name is required."
                });
                return;
            }

            const users = await UserModel.findByName(searchName);

            res.status(200).json({
                count: users.length,
                data: users
            });
        }catch (err) {
            res.status(500).json({
                message: "Internal server error",
                err
            });
        }
    }

    static async getById(req: Request, res: Response): Promise<void> {
        try{
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                res.status(400).json({
                    message: "A valid user id is required."
                });
                return;
            }

            const user = await UserModel.findById(id);

            if (!user) {
                res.status(404).json({
                    message: "User not found."
                });
                return;
            }

            res.status(200).json({
                data: user
            });
        }catch (err) {
            res.status(500).json({
                message: "Internal server error",
                err
            });
        }
    }

    static async updateById(req: Request, res: Response): Promise<void> {
        try{
            const id = Number(req.params.id);
            const {name, email} = req.body;

            if (Number.isNaN(id)) {
                res.status(400).json({
                    message: "A valid user id is required."
                });
                return;
            }

            if (typeof name !== "string" || typeof email !== "string") {
                res.status(400).json({
                    message: "name and email are required."
                });
                return;
            }

            const updatedUser = new UserModel(name.trim(), email.trim());
            const result = await UserModel.updateById(id, updatedUser);

            if (result.affectedRows === 0) {
                res.status(404).json({
                    message: "User not found."
                });
                return;
            }

            res.status(200).json({
                message: "User updated successfully."
            });
        }catch (err) {
            res.status(500).json({
                message: "Internal server error",
                err
            });
        }
    }

    static async delete(req: Request, res: Response): Promise<void> {
        try{
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                res.status(400).json({
                    message: "A valid user id is required."
                });
                return;
            }

            const result = await UserModel.deleteById(id);

            if (result.affectedRows === 0) {
                res.status(404).json({
                    message: "User not found."
                });
                return;
            }

            res.status(200).json({
                message: "User deleted successfully."
            })

        }catch (err) {
            res.status(500).json({
                message: "Internal server error",
                err
            });
        }
    }
}

export default UserController;
