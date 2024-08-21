// const auth = require('../config/auth');

// exports.refreshToken = async (req, res) => {
//     try {
//         const refreshToken = req.body.refreshToken;
        
//         if (!refreshToken) {
//             return res.status(401).json({ message: 'Refresh token não fornecido.' });
//         }

//         const newToken = auth.refreshToken(refreshToken);

//         return res.status(200).json({ token: newToken });
//     } catch (error) {
//         return res.status(403).json({ message: 'Token inválido.' });
//     }
// };

// exports.logoutUser = (req, res) => {
//     try {
//         // Para logout, simplesmente invalide o token no front-end
//         return res.status(200).json({ message: 'Logout realizado com sucesso!' });
//     } catch (error) {
//         return res.status(500).json({ message: 'Erro ao realizar logout.' });
//     }
// };
