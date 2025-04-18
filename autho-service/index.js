const express = require("express");
const app = express();
const PORT = process.env.PORT || 3004;
const mongoose = require("mongoose");
const Utilisateur = require('./model/Utilisateur');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

mongoose.set('strictQuery', true);

// Use environment variables from docker-compose
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';
const DB_NAME = process.env.DB_NAME || 'auth-service';
const DB_USER = process.env.DB_USER || 'admin';
const DB_PASSWORD = process.env.DB_PASSWORD || 'password';

const mongoURI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connecté à MongoDB"))
.catch(err => console.error("Erreur de connexion:", err));

app.use(express.json());


app.post("/auth/register", async (req, res) => {
    const { nom, email, mot_passe } = req.body;
    
    try {
       
        const utilisateurExiste = await Utilisateur.findOne({ email });
        if (utilisateurExiste) {
            return res.status(400).json({ message: "L'utilisateur existe déjà" });
        }

       
        
        const hashedPassword = await bcrypt.hash(mot_passe, 10);

        
        const nouvelUtilisateur = new Utilisateur({
            nom,
            email,
            mot_passe: hashedPassword
        });

        await nouvelUtilisateur.save();
        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/auth/login", async (req, res) => {
    const { email, mot_passe } = req.body;
    
    try {
        
        const utilisateur = await Utilisateur.findOne({ email });
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        
        const isMatch = await bcrypt.compare(mot_passe, utilisateur.mot_passe);
        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        
        const payload = {
            email: utilisateur.email,
            nom: utilisateur.nom
        };

        jwt.sign(payload, "secret", { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Erreur lors de la génération du token" });
            }
            res.json({ token });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Auth-Service démarré sur le port ${PORT}`);
});