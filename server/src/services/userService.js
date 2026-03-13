const userRepository = require('../repositories/userRepository');

const getAllUsers = async (role) => {
  return await userRepository.findAll(role);
};

const getUserById = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const createUser = async (userData) => {
  // Business logic validation can go here
  if (!userData.email) {
    throw new Error('Email is required');
  }
  return await userRepository.create(userData);
};

const updateUser = async (id, userData) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return await userRepository.update(id, userData);
};

const deleteUser = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return await userRepository.remove(id);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
