const mongoose = require("mongoose");

const livraisonSchema = new mongoose.Schema({
  commande_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  adresse: {
    type: String,
    required: true
  },
  statut: {
    type: String,
    enum: ['en attente', 'en cours', 'livrée', 'annulée'],
    default: 'en attente'
  },
  date_livraison_estimee: {
    type: Date,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Livraison", livraisonSchema); 