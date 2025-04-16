const mongoose = require("mongoose");

const commandeSchema = new mongoose.Schema({
  produits: {
    type: [String],
    required: true
  },
  email_utilisateur: {
    type: String,
    required: true
  },
  prix_total: {
    type: Number,
    required: true,
    min: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Commande", commandeSchema); 