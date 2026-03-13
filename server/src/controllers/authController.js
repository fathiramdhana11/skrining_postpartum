const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { nama_lengkap, email, password, role, secretCode } = req.body;
    
    // Basic validation
    if (!nama_lengkap || !email || !password) {
      return res.status(400).json({ message: 'Mohon lengkapi semua data' });
    }

    const user = await authService.register({ nama_lengkap, email, password, role, secretCode });
    res.status(201).json({
      message: 'Registrasi berhasil',
      data: {
        id: user.id,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' });
    }

    const result = await authService.login(email, password);
    res.json({
      message: 'Login berhasil',
      data: result
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
};
