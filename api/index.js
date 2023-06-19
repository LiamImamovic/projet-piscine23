import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import favoritesRoutes from "./routes/favorites.js";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();

// Middleware pour gérer les données JSON
app.use(express.json());

// Middleware pour gérer les cookies
app.use(cookieParser());

// Configuration du stockage des fichiers avec Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client/public/upload"); // Spécifie le dossier de destination pour les fichiers uploadés
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname); // Génère un nom de fichier unique basé sur la date actuelle et le nom original du fichier
  }
});

const upload = multer({ storage });

// Route pour gérer le téléchargement de fichiers
app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename); // Renvoie le nom du fichier téléchargé
});

// Routes pour les fonctionnalités d'authentification
app.use("/api/auth", authRoutes);

// Routes pour les fonctionnalités liées aux utilisateurs
app.use("/api/user", userRoutes);

// Routes pour les fonctionnalités liées aux articles
app.use("/api/posts", postRoutes);

// Routes pour les fonctionnalités liées aux commentaires
app.use("/api/comments", commentRoutes);

// Routes pour les fonctionnalités liées aux favoris
app.use("/api/favorites", favoritesRoutes);

// Démarrage du serveur
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
