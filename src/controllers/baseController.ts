import { Response } from "express";

class BaseController {

    protected ok(res: Response, payload: unknown, statusCode = 200): void {
        res.status(statusCode).json(payload);
    }

    protected created(res: Response, payload: unknown): void {
        this.ok(res, payload, 201);
    }

    protected fail(res: Response, error: unknown): void {
        console.error(error);

        const message =
            error instanceof Error ? error.message : "Internal Server Error";

        res.status(400).json({ message });
    }

    protected async execute(
        res: Response,
        action: () => Promise<void>
    ): Promise<void> {
        try {
            await action();
        } catch (error) {
            this.fail(res, error);
        }
    }
}

export default BaseController;