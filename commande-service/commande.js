// commande-service/index.js
const express = require("express");
const app = express();
const PORT = 3002;
const mongoose = require("mongoose");
const Commande = require("./models/Commande");
const verifyToken = require('./middleware/auth');


mongoose.set('strictQuery', true);

// Use environment variables from docker-compose
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';
const DB_NAME = process.env.DB_NAME || 'commande-service';
const DB_USER = process.env.DB_USER || 'admin';
const DB_PASSWORD = process.env.DB_PASSWORD || 'password';

const mongoURI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Commande DB Connected"))
.catch(err => console.error("Erreur de connexion:", err));

// Order Model
// const Commande = mongoose.model("Commande", new mongoose.Schema({
//   produits: [String], 
//   email_utilisateur: String,
//   prix_total: Number,
//   created_at: { type: Date, default: Date.now }
// }));

// Middleware
app.use(express.json());

// Routes
app.post("/commande/ajouter", verifyToken, async (req, res) => {
  try {
    const { produits, prix_total } = req.body;
    const email_utilisateur = req.user.email; // Get email from token

    if (!produits || !Array.isArray(produits) || produits.length === 0) {
      return res.status(400).json({ error: "Liste de produits invalide" });
    }
    if (!prix_total || prix_total <= 0) {
      return res.status(400).json({ error: "Prix total invalide" });
    }

    const commande = new Commande({
      produits,
      email_utilisateur,
      prix_total
    });

    await commande.save();
    res.status(201).json({
      message: "Commande créée avec succès",
      commande
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/commande/liste", verifyToken, async (req, res) => {
  try {
    const commandes = await Commande.find({ email_utilisateur: req.user.email });
    res.json({
      count: commandes.length,
      commandes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/commande/:id', verifyToken, async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id);
    if (!commande) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    res.json(commande);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Commande Service running on port ${PORT}`);
});