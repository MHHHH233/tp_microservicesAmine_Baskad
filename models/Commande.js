const mongoose = require("mongoose");

const commandeSchema = new mongoose.Schema({
  produits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produit',
    required: true
  }],
  email_utilisateur: {
    type: String,
    required: true
  },
  prix_total: {
    type: Number,
    required: true
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Commande", commandeSchema); 