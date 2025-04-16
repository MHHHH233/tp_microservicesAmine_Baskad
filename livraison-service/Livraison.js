const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const Livraison = require('./models/Livraison');
const app = express();
const verifyToken = require('./middleware/auth');
const PORT = 3003;

app.use(express.json());

// Use environment variables from docker-compose
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';
const DB_NAME = process.env.DB_NAME || 'livraison-service';
const DB_USER = process.env.DB_USER || 'admin';
const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3002';

app.post('/livraison/ajouter', verifyToken, async (req, res) => {
  try {
    const response = await axios.get(
      `${ORDER_SERVICE_URL}/commande/${req.body.commande_id}`,
      {
        headers: {
          'Authorization': req.headers.authorization
        }
      }
    );
    if (!response.data) {
      return res.status(404).send({ error: 'Commande non trouvée' });
    }

    const livraison = new Livraison(req.body);
    await livraison.save();
    res.status(201).send(livraison);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return res.status(401).send({ error: 'Non autorisé à accéder à cette commande' });
    }
    res.status(400).send(error);
  }
});

app.put('/livraison/:id', verifyToken, async (req, res) => {
    try {
      const livraison = await Livraison.findByIdAndUpdate(
        req.params.id,
        { statut: req.body.statut },
        { new: true }
      );
      if (!livraison) return res.status(404).send();
      res.send(livraison);
    } catch (error) {
      res.status(400).send(error);
    }
  });

const mongoURI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => console.log(`Microservice Livraison démarré sur le port ${PORT}`));
})
.catch(err => console.error("Erreur de connexion:", err));