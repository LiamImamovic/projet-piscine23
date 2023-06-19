import express from 'express';
import { deleteUser, getPostByUser, getUser, updateUser, getAllUsers } from '../controllers/user.js';

const router = express.Router();

// Définition des routes pour la gestion des utilisateurs
router.get("/", getAllUsers); // Route pour récupérer tous les utilisateurs
router.get("/:id", getUser); // Route pour récupérer un utilisateur spécifique en utilisant l'ID de l'utilisateur
router.put("/:id", updateUser); // Route pour mettre à jour les informations d'un utilisateur en utilisant l'ID de l'utilisateur
router.delete("/:id", deleteUser); // Route pour supprimer un utilisateur en utilisant l'ID de l'utilisateur
router.get("/:id/posts", getPostByUser); // Route pour récupérer les articles d'un utilisateur spécifique en utilisant l'ID de l'utilisateur

export default router;
