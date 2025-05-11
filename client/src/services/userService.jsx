import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:3000/api', // Update if needed for production
  withCredentials: true, // Include cookies (e.g., for JWT)
});

const userService = {
  // General error handler
  handleError(err) {
    if (err.response) {
      return err.response.data || { message: 'Unknown server error' };
    } else if (err.request) {
      return { message: 'No response from server' };
    } else {
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

  updateProfile: (formData) => {
    return http.put('/users/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => res.data.data)
      .catch(err => { throw userService.handleError(err) });
  },

  // Optional fallback (if using localStorage for JWT)
  getLoggedInUser: () => {
    return http.get('/user', { 
      headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` }
    });
  }
};

export default userService;
