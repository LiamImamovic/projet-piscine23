import jwt from "jsonwebtoken"; // Importation du module jsonwebtoken pour la gestion des tokens JWT
import { db } from "../db.js"; // Importation du module db.js contenant la configuration de la base de données

export const getUser = async (req, res) => {
  const q = "SELECT * FROM users WHERE `id` = ?";
  
  // Récupération d'un utilisateur spécifique depuis la base de données
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data[0]);
  });
};

export const updateUser = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  // Vérification de l'authenticité du token JWT
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(err).json("Token is not valid!");

    const userId = req.params.id;

    const q = "UPDATE users SET `img`=? WHERE `id` = ?";
    const values = [req.body.img, userId];

    // Mise à jour des informations de l'utilisateur dans la base de données
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("User has been updated.");
    });
  });
};

export const deleteUser = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  // Vérification de l'authenticité du token JWT
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(err).json("Token is not valid!");

    const userId = req.params.id;

    const q = "DELETE FROM users WHERE `id` = ?";

    // Suppression de l'utilisateur de la base de données
    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("User has been deleted.");
    });
  });
};

export const getPostByUser = async (req, res) => {
  const q = "SELECT * FROM posts WHERE `uid` = ?";

  // Récupération des posts d'un utilisateur spécifique depuis la base de données
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
}
