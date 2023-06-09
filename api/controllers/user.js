import jwt from "jsonwebtoken"; // Importation du module jsonwebtoken pour la gestion des tokens JWT
import { db } from "../db.js"; // Importation du module db.js contenant la configuration de la base de données

// Récupération d'un utilisateur spécifique
export const getUser = async (req, res) => {
  const q = "SELECT * FROM users WHERE `id` = ?";

  // Exécution de la requête SQL pour récupérer un utilisateur spécifique depuis la base de données
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data[0]);
  });
};

// Mise à jour des informations d'un utilisateur
export const updateUser = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  // Vérification de l'authenticité du token JWT
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(err).json("Token is not valid!");

    const userId = req.params.id;

    const q = "UPDATE users SET `img`=? WHERE `id` = ?";
    const values = [req.body.img, userId];

    // Exécution de la requête SQL pour mettre à jour les informations de l'utilisateur dans la base de données
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("User has been updated.");
    });
  });
};

// Suppression d'un utilisateur
export const deleteUser = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  // Vérification de l'authenticité du token JWT
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(401).json("Token is not valid!");

    const userId = req.params.id;
    const adminId = userInfo.id; // ID de l'administrateur connecté

    // Vérification si l'utilisateur connecté est un administrateur
    const adminQuery = "SELECT isAdmin FROM users WHERE id = ?";
    db.query(adminQuery, [adminId], (adminErr, adminData) => {
      if (adminErr) return res.status(500).json(adminErr);

      if (
        adminData.length === 0 ||
        (adminData[0].isAdmin !== 1 && userId !== adminId && userId !== userInfo.id)
      ) {
        return res.status(401).json("Unauthorized");
      }

      // Suppression de l'utilisateur de la base de données
      const deleteQuery = "DELETE FROM users WHERE id = ?";
      db.query(deleteQuery, [userId], (deleteErr, deleteData) => {
        if (deleteErr) return res.status(500).json(deleteErr);

        if (deleteData.affectedRows === 0) {
          return res.status(404).json("User not found.");
        }

        return res.json("User has been deleted.");
      });
    });
  });
};

// Récupération des articles d'un utilisateur spécifique
export const getPostByUser = async (req, res) => {
  const q = "SELECT * FROM posts WHERE `uid` = ?";

  // Exécution de la requête SQL pour récupérer les articles d'un utilisateur spécifique depuis la base de données
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// Récupération de tous les utilisateurs
export const getAllUsers = (req, res) => {
  const q = "SELECT * FROM users";

  // Exécution de la requête SQL pour récupérer tous les utilisateurs depuis la base de données
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
