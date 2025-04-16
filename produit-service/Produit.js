const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const mongoose = require("mongoose");
const axios = require("axios"); // Add axios for HTTP requests
const verifyToken = require('./middleware/auth'); // Import auth middleware

// Use environment variables from docker-compose
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';
const DB_NAME = process.env.DB_NAME || 'produit-service';
const DB_USER = process.env.DB_USER || 'admin';
const DB_PASSWORD = process.env.DB_PASSWORD || 'password';

const mongoURI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log("Produit DB Connected"))
  .catch(err => console.error("Erreur de connexion:", err));


const Produit = mongoose.model("Produit", new mongoose.Schema({
  nom: String,
  description: String,
  prix: Number,
  created_at: { type: Date, default: Date.now }
}));


app.use(express.json());


app.post("/produit/ajouter", async (req, res) => {
  try {
    const { nom, description, prix } = req.body;
    
    
    if (!nom || !description || !prix) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const produit = new Produit({ 
      nom, 
      description, 
      prix: Number(prix) 
    });
    
    await produit.save();
    res.status(201).json({
      message: "Produit ajouté avec succès",
      produit
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/produit/acheter", verifyToken, async (req, res) => {
  try {
    let ids = req.query.ids || [];
    
    // Convert to array if string
    if (typeof ids === 'string') {
      ids = [ids];
    }
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "IDs des produits requis" });
    }

    const produits = await Produit.find({ 
      _id: { $in: ids } 
    });
    
    if (produits.length === 0) {
      return res.status(404).json({ message: "Aucun produit trouvé" });
    }
    
    res.json({
      count: produits.length,
      produits
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a POST endpoint for the same functionality
app.post("/produit/acheter", verifyToken, async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "IDs des produits requis" });
    }

    const produits = await Produit.find({ 
      _id: { $in: ids } 
    });
    
    if (produits.length === 0) {
      return res.status(404).json({ message: "Aucun produit trouvé" });
    }
    
    // Calculate total price
    const prix_total = produits.reduce((total, produit) => total + produit.prix, 0);

    // Call the commande-service to create an order
    try {
      // Get the commande service URL from environment or use default
      const COMMANDE_SERVICE_URL = process.env.COMMANDE_SERVICE_URL || 'http://commande-service:3002';
      
      // Forward the authorization header to the commande service
      const response = await axios.post(
        `${COMMANDE_SERVICE_URL}/commande/ajouter`, 
        {
          produits: produits.map(p => p._id.toString()),
          prix_total
        }, 
        {
          headers: {
            'Authorization': req.headers.authorization
          }
        }
      );
      
      // Return both products info and order info
      res.status(201).json({
        message: "Commande créée avec succès",
        produits,
        commande: response.data.commande
      });
      
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error.message);
      // Still return products but with error message for order
      res.status(207).json({
        message: "Produits trouvés mais erreur lors de la création de la commande",
        error: error.response?.data?.error || error.message,
        produits
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.get("/produit/liste", async (req, res) => {
  try {
    const produits = await Produit.find();
    res.json({
      count: produits.length,
      produits
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




app.listen(PORT, () => {
  console.log(`Produit Service running on port ${PORT}`);
});