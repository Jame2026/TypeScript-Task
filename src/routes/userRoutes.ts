import express from "express";
import UserController from "../controllers/userController";

const router = express.Router();

router.get("/users", UserController.getAll);
router.get("/users/search/:name", UserController.searchByName);
router.get("/users/:id", UserController.getById);
router.post("/users/create", UserController.create);
router.put("/users/edit/:id", UserController.updateById);
router.delete("/users/:id", UserController.delete);

export default router;
