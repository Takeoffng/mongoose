import express from "express"
import { createUser, getAllUsers, signIn } from "../controllers/userController.js"
import { verifyJWToken } from "../middlewares/jwtAuth.js"


const router = express.Router();

router.get("/all", verifyJWToken, getAllUsers);

router.post("/register", createUser);

router.post("/signin", signIn );

export default router