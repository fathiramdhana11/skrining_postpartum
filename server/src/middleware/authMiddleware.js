const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak, token tidak tersedia' });
  }

  try {
    const bearerToken = token.split(' ')[1]; 
    if(!bearerToken) {
      return res.status(401).json({ message: 'Format token salah' });
    }

    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET || 'rahasia_negara');
    
    // Validasi session id di database (multi-device protection)
    const userRepository = require('../repositories/userRepository');
    const user = await userRepository.findById(decoded.user.id);

    if (!user || user.session_id !== decoded.user.session_id) {
      return res.status(401).json({ 
        message: 'Sesi anda telah berakhir karena login di perangkat lain',
        code: 'DUPLICATE_SESSION'
      });
    }

    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'Token tidak valid atau telah kadaluwarsa' });
  }
};
