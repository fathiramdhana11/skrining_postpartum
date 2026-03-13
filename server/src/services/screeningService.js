const screeningRepository = require('../repositories/screeningRepository');

const saveScreening = async (screeningData) => {
  return await screeningRepository.create(screeningData);
};

const getHistoryByUserId = async (userId) => {
  return await screeningRepository.findByUserId(userId);
};

const getAllScreenings = async () => {
  return await screeningRepository.findAll();
};

const deleteScreening = async (id) => {
  return await screeningRepository.deleteById(id);
};

const updateScreeningNotes = async (id, catatan_nakes, status_penanganan, handled_by, tindakan_nakes, soap_s, soap_o, soap_a, soap_p) => {
  return await screeningRepository.updateNotes(id, catatan_nakes, status_penanganan, handled_by, tindakan_nakes, soap_s, soap_o, soap_a, soap_p);
};

module.exports = {
  saveScreening,
  getHistoryByUserId,
  getAllScreenings,
  deleteScreening,
  updateScreeningNotes
};
