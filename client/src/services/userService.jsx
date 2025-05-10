import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:3000/api', // Base URL for your backend API
  withCredentials: true,  // Make sure your server is configured to accept credentials (cookies)
});

const userService = {
  // General function for handling errors
  handleError(err) {
    if (err.response) {
      // The request was made, but the server responded with an error
      return err.response.data || { message: 'Unknown server error' };
    } else if (err.request) {
      // The request was made but no response received
      return { message: 'No response from server' };
    } else {
      // Something else happened in setting up the request
      return { message: err.message };
    }
  },

  register: (userData) => {
    return http.post('/register', userData)
      .then(res => res.data)
      .catch(err => { throw userService.handleError(err) });
  },

  login: (credentials) => {
    return http.post('/login', credentials)
      .then(res => res.data)
      .catch(err => { throw userService.handleError(err) });
  },

  logout: () => {
    return http.post('/logout')
      .then(res => res.data)
      .catch(err => { throw userService.handleError(err) });
  },

  getCurrentUser: () => {
    return http.get('/users/current')
      .then(res => res.data)
      .catch(err => { throw userService.handleError(err) });
  },

   getOne: (id) => {
    return http.get(`/users/${id}`)
    .then(res => res.data.data)
    .catch(err => { throw userService.handleError(err) });
  },
  update: (id, data) =>
    http.patch(`/users/${id}`, data)
      .then(res => res.data)
      .catch(err => { throw err }),
  
  // Assuming you store the JWT in cookies
  getLoggedInUser: () => {
    return http.get('/user', { 
      headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` }
    });
  }
};

export default userService;
