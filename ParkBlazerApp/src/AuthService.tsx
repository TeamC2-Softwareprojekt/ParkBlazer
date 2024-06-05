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

  // Logut the current user
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.reload();
  },

  // Get current user token
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Check if user is logged in
  isLoggedIn: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token; 
  }
};

export default AuthService;
