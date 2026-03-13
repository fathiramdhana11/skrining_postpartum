const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (userData) => {
  const { nama_lengkap, email, password, role, secretCode } = userData;

  // 1. Validasi Khusus Tenaga Kesehatan & Superadmin
  if (role === 'tenagakesehatan') {
    if (secretCode !== process.env.NAKES_SECRET_CODE) {
      throw new Error('Kode verifikasi tenaga kesehatan salah!');
    }
  } else if (role === 'superadmin') {
    if (secretCode !== (process.env.SUPERADMIN_SECRET_CODE || 'superadmin123')) {
       throw new Error('Kode verifikasi superadmin salah!');
    }
  }

  // 2. Cek apakah email sudah terdaftar
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error('Email sudah terdaftar');
  }

  // 3. Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4. Simpan User Baru
  const newUser = await userRepository.create({
    nama_lengkap,
    email,
    password: hashedPassword,
    role: role || 'pasien', // Default role pasien jika tidak diisi
  });

  return newUser;
};

const login = async (email, password) => {
  // 1. Cari User by Email
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error('Email atau password salah');
  }

  // 2. Cek Password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Email atau password salah');
  }

  // 3. Generate Session ID (Unique per login)
  const sessionId = Date.now().toString(); // Simple unique session id
  await userRepository.updateSession(user.id, sessionId);

  // 4. Generate Token with Session ID
  const payload = {
    user: {
      id: user.id,
      role: user.role,
      session_id: sessionId
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || 'rahasia_negara', {
    expiresIn: '1h',
  });

  return { token, user: { id: user.id, nama_lengkap: user.nama_lengkap, email: user.email, role: user.role } };
};

module.exports = {
  register,
  login,
};
