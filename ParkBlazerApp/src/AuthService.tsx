import axios from 'axios';

const TOKEN_KEY = 'jwtToken';

const AuthService = {
  // Handle a user login
  login: async (email: any, password: any) => {
    try {
      // Send request to server
      const response = await axios.post('https://server-y2mz.onrender.com/api/login_user', {
         email: email,
         password: password
        });
      const token = response.data.token;
      localStorage.setItem(TOKEN_KEY, token);
      return token;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("An unexpected error occurred. Please try again later!");
      }
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.reload();
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
