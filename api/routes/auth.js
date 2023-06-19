import express from "express";
import { register, login, logout } from "../controllers/auth.js";

const router = express.Router();

// Définition des routes pour l'inscription, la connexion et la déconnexion
router.post("/register", register); // Route pour l'inscription
router.post("/login", login); // Route pour la connexion
router.post("/logout", logout); // Route pour la déconnexion

export default router;
