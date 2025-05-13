import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:3000/api/ideas',
  withCredentials: true,
});

const ideaService = {
  // Create a new idea
  create: (ideaData) => {
    console.log('Creating new idea with data:', ideaData);
    return http.post('/create', ideaData)
      .then(res => res.data)
      .catch(err => { 
        console.error('Error creating idea:', err);
        throw err;
      });
  },

  // Get all ideas
  getAll: () => {
    console.log('Fetching all ideas...');
    return http.get('/')
      .then(res => res.data)
      .catch(err => {
        console.error('Error fetching ideas:', err);
        throw err;
      });
  },

  // Get most supported ideas
  getMostSupported: () => {
    console.log('Fetching most supported ideas...');
    return http.get('/most-supported')  // Updated endpoint for most supported
      .then(res => res.data)
      .catch(err => {
        console.error('Error fetching most supported ideas:', err);
        throw err;
      });
  },


// Add this to ideaService.js

toggleInspiring: (id) => {
  console.log(`Toggling inspiring for idea with ID: ${id}`);
  return http.patch(`/${id}/inspiring`)
    .then(res => res.data.data)
    .catch(err => {
      console.error(`Error toggling inspiring for idea with ID ${id}:`, err);
      throw err;
    });
},





  // Get most inspiring ideas
  getMostInspiring: () => {
    console.log('Fetching most inspiring ideas...');
    return http.get('/most-inspiring')  // Updated endpoint for most inspiring
      .then(res => res.data)
      .catch(err => {
        console.error('Error fetching most inspiring ideas:', err);
        throw err;
      });
  },

  // Get a single idea
  getOne: (id) => {
    console.log(`Fetching idea with ID: ${id}`);
    return http.get(`/${id}`)
      .then(res => res.data.data)
      .catch(err => {
        console.error(`Error fetching idea with ID ${id}:`, err);
        throw err;
      });
  },

  // Get ideas by user
  getByUser: (userId) => {
    console.log(`Fetching ideas by user with ID: ${userId}`);
    return http.get(`/user/${userId}`)
      .then(res => res.data.data)
      .catch(err => {
        console.error(`Error fetching ideas by user ${userId}:`, err);
        throw err;
      });
  },

  // Update an idea
  update: (id, updatedData) => {
    console.log(`Updating idea with ID: ${id} with data:`, updatedData);
    return http.put(`/${id}`, updatedData)
      .then(res => res.data.data)
      .catch(err => {
        console.error(`Error updating idea with ID ${id}:`, err);
        throw err;
      });
  },

  // Delete an idea
  delete: (id) => {
    console.log(`Deleting idea with ID: ${id}`);
    return http.delete(`/${id}`)
      .then(res => res.data)
      .catch(err => {
        console.error(`Error deleting idea with ID ${id}:`, err);
        throw err;
      });
  },

  // Toggle support for an idea
  toggleSupport: (id) => {
    console.log(`Toggling support for idea with ID: ${id}`);
    return http.post(`/${id}/toggle-support`)  // Updated route for toggle support
      .then(res => res.data.data)
      .catch(err => {
        console.error(`Error toggling support for idea with ID ${id}:`, err);
        throw err;
      });
  },

  // Toggle inspiration for an idea
  toggleInspiration: (id) => {
    console.log(`Toggling inspiration for idea with ID: ${id}`);
    return http.post(`/${id}/toggle-inspiration`)  // Updated route for toggle inspiration
      .then(res => res.data.data)
      .catch(err => {
        console.error(`Error toggling inspiration for idea with ID ${id}:`, err);
        throw err;
      });
  },

  // Get reactions (inspirations and supports) for an idea
  getReactions: (id) => {
    console.log(`Fetching reactions for idea with ID: ${id}`);
    return http.get(`/${id}/reactions`)
      .then(res => res.data.data)
      .catch(err => {
        console.error(`Error fetching reactions for idea with ID ${id}:`, err);
        throw err;
      });
  },

  // Create a comment on an idea
  createComment: (id, content) => {
    console.log(`Creating comment on idea with ID: ${id}`);
    return http.post(`/${id}/comments`, { content })
      .then(res => res.data)
      .catch(err => {
        console.error(`Error creating comment on idea with ID ${id}:`, err);
        throw err;
      });
  },

  // Get likes for an idea (optional)
  getLikes: (ideaId) => {
    console.log(`Fetching all likers for idea with ID: ${ideaId}`);
    return http.get(`/${ideaId}/likes`)
      .then(res => res.data.data)
      .catch(err => {
        console.error(`Error fetching likers for idea with ID ${ideaId}:`, err);
        throw err;
      });
  },
};

export default ideaService;
