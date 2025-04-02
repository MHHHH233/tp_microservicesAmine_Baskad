const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Token d'authentification manquant" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, "secret");
        req.user = decoded; // { email, nom }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token invalide ou expiré" });
    }
};

module.exports = verifyToken; 