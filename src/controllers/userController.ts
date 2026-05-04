import { Request, Response } from "express";
import BaseController from "./baseController";
import userService from "../services/userService";

type IdParams = { id: string };
type NameParams = { name: string };

class UserController extends BaseController {

    getAll = async (_req: Request, res: Response): Promise<void> =>
        this.execute(res, async () => {
            const users = await userService.getAll();

            this.ok(res, {
                count: users.length,
                data: users
            });
        });

    getById = async (req: Request<IdParams>, res: Response): Promise<void> =>
        this.execute(res, async () => {
            const user = await userService.getById(req.params.id);

            this.ok(res, user);
        });

    searchByName = async (req: Request<NameParams>, res: Response): Promise<void> =>
        this.execute(res, async () => {
            const users = await userService.searchByName(req.params.name);

            this.ok(res, {
                count: users.length,
                data: users
            });
        });

    create = async (req: Request, res: Response): Promise<void> =>
        this.execute(res, async () => {
            const result = await userService.create(req.body);

            this.created(res, {
                message: "User created successfully",
                insertId: result.insertId
            });
        });

    updateById = async (req: Request<IdParams>, res: Response): Promise<void> =>
        this.execute(res, async () => {
            await userService.updateById(req.params.id, req.body);

            this.ok(res, {
                message: "User updated successfully"
            });
        });

    deleteById = async (req: Request<IdParams>, res: Response): Promise<void> =>
        this.execute(res, async () => {
            await userService.deleteById(req.params.id);

            this.ok(res, {
                message: "User deleted successfully"
            });
        });
}

export default new UserController();