import { Router } from "express";
import { register, login, refresh, logout } from "./auth.controller.js";
import { registerValidator, loginValidator, validate } from "./auth.validator.js";

const router = Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
