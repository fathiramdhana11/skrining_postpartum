const screeningService = require('../services/screeningService');
const userRepository = require('../repositories/userRepository');

const submitScreening = async (req, res) => {
  try {
    const { user_id, total_score, kategori, jawaban_json } = req.body;
    
    // Basic validation
    if (!user_id || total_score === undefined || !kategori) {
      return res.status(400).json({ message: 'Data skrining tidak lengkap' });
    }

    // Fetch User Profile for Snapshot
    const userProfile = await userRepository.findById(user_id);
    // Remove sensitive info if needed (password usually not returned by findById if implemented well, check repo)
    
    // Calculate Suicide Risk Flag (Question 10 / Index 9)
    const q10Score = jawaban_json ? (jawaban_json['9'] || 0) : 0;
    const flag_bunuh_diri = q10Score > 0; // Any score > 0 on Q10 is a risk signal

    const screeningData = { 
        ...req.body, 
        flag_bunuh_diri,
        profile_snapshot: userProfile // Save current profile state
    };

    const result = await screeningService.saveScreening(screeningData);
    res.status(201).json({ message: 'Hasil skrining berhasil disimpan', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menyimpan hasil skrining' });
  }
};

const getHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await screeningService.getHistoryByUserId(userId);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllScreenings = async (req, res) => {
  try {
    const screenings = await screeningService.getAllScreenings();
    res.json(screenings);
  } catch (error) {
    console.error('Error getting all screenings:', error);
    res.status(500).json({ message: 'Gagal mengambil data skrining' });
  }
};

const deleteScreening = async (req, res) => {
  try {
    const { id } = req.params;
    await screeningService.deleteScreening(id);
    res.json({ message: 'Riwayat skrining berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting screening:', error);
    res.status(500).json({ message: 'Gagal menghapus riwayat skrining' });
  }
};

const updateNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { catatan_nakes, status_penanganan, handled_by, tindakan_nakes, soap_s, soap_o, soap_a, soap_p } = req.body;
    const updatedScreening = await screeningService.updateScreeningNotes(id, catatan_nakes, status_penanganan, handled_by, tindakan_nakes, soap_s, soap_o, soap_a, soap_p);
    res.json(updatedScreening);
  } catch (error) {
    console.error('Error updating notes:', error);
    res.status(500).json({ message: 'Gagal mengupdate catatan' });
  }
};

module.exports = {
  submitScreening,
  getHistory,
  getAllScreenings,
  deleteScreening,
  updateNotes
};
