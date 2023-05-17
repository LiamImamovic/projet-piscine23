import { db } from "../db.js"; // Importation du module db.js contenant la configuration de la base de données
import bcrypt from "bcryptjs"; // Importation du module bcrypt pour le chiffrement du mot de passe
import jwt from "jsonwebtoken"; // Importation du module jsonwebtoken pour la gestion des tokens JWT

export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

  // Vérification si l'utilisateur existe déjà dans la base de données
  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    const salt = bcrypt.genSaltSync(10); // Génération d'un sel pour le chiffrement du mot de passe
    const hash = bcrypt.hashSync(req.body.password, salt); // Chiffrement du mot de passe

    const q = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)";
    const values = [req.body.username, req.body.email, hash];

    // Insertion du nouvel utilisateur dans la base de données
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {

  const q = "SELECT * FROM users WHERE username = ?";

  // Recherche de l'utilisateur dans la base de données
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    // Vérification de la correspondance du mot de passe saisi avec le mot de passe stocké dans la base de données
    if (!isPasswordCorrect)
      return res.status(400).json("Wrong username or password!");

    const token = jwt.sign({ id: data[0].id }, "jwtkey"); // Génération d'un token JWT contenant l'identifiant de l'utilisateur
    const { password, ...other } = data[0]; // Suppression du champ de mot de passe de l'objet de données utilisateur

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  });
};

export const logout = (req, res) => {
  // Déconnexion de l'utilisateur en supprimant le cookie d'accès
  res.clearCookie("access_token",{
    sameSite:"none",
    secure:true
  }).status(200).json("User has been logged out.")
};
