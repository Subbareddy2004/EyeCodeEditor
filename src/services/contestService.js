import axios from 'axios';

// Update the completeProblem function
export const completeProblem = async (contestId, problemId, code) => {
  try {
    const response = await axios.post(
      `${API_URL}/contests/${contestId}/problems/${problemId}/complete`,
      { code },  // Remove userId from request body since we'll use the token
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error completing problem:', error);
    throw error;
  }
}; 