const express = require("express");
const app = express();
const PORT = 4000;
const mongoose = require("mongoose");
const Produit = require("./models/Produit");
const verifyToken = require('./middleware/auth');

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/produit-service", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Produit DB Connected"))
.catch(err => console.error(err));


// const Produit = mongoose.model("Produit", new mongoose.Schema({
//   nom: String,
//   description: String,
//   prix: Number,
//   created_at: { type: Date, default: Date.now }
// }));


app.use(express.json());


app.post("/produit/ajouter", verifyToken, async (req, res) => {
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

// Update the POST /produit/acheter endpoint to calculate total price
app.post("/produit/acheter", verifyToken, async (req, res) => {
  try {
    const { ids } = req.body;
    const email_utilisateur = req.user.email; // Get email from token
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "IDs des produits requis" });
    }

    const produits = await Produit.find({ 
      _id: { $in: ids } 
    });
    
    if (produits.length === 0) {
      return res.status(404).json({ message: "Aucun produit trouvé" });
    }

    const prix_total = produits.reduce((total, produit) => total + produit.prix, 0);
    
    // Create order in commande service
    const commandeResponse = await fetch('http://localhost:4001/commande/ajouter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization // Forward the auth token
      },
      body: JSON.stringify({
        produits: ids,
        email_utilisateur,
        prix_total
      })
    });

    const commandeData = await commandeResponse.json();
    
    res.json({
      count: produits.length,
      produits,
      commande: commandeData
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.get("/produit/liste", verifyToken, async (req, res) => {
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