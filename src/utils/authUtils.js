export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token ? 'exists' : 'missing'); // Debug log
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const isUserFaculty = (user) => {
  return user?.role === 'faculty';
}; 