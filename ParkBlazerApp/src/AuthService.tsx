import axios from 'axios';

const TOKEN_KEY = 'jwtToken';

const AuthService = {
  login: async (email: any, password: any) => {
    try {
      const response = await axios.post('https://server-y2mz.onrender.com/api/login', { email, password });
      const token = response.data.token;
      localStorage.setItem(TOKEN_KEY, token);
      return token;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('An error occurred while logging in. Please try again later.');
      }
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  isLoggedIn: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token; // True if token exists, false otherwise
  }
};

export default AuthService;
