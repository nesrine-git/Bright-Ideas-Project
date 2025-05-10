import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:3000/api/ideas', // Direct backend API
  withCredentials: true
});

const ideaService = {
  // Create a new idea
  create: (ideaData) =>
    http.post('/', ideaData)
      .then(res => res.data)
      .catch(err => { throw err }),

  // Get all ideas
  getAll: () =>
    http.get('/')
      .then(res => res.data)
      .catch(err => { throw err }),

  // Get all ideas by most liked
    getMostLiked: () =>
      http.get('/most-liked')
      .then(res => res.data)
      .catch(err => { throw err }),
      
  // Get a single idea
  getOne: (id) =>
    http.get(`/${id}`)
      .then(res => res.data)
      .catch(err => { throw err }),
  
  getByUser: (userId) =>
    http.get(`/user/${userId}`)
    .then(res => res.data.data)
    .catch(err => {
      throw err.response?.data || { message: 'Failed to fetch user ideas' }}),

  // Update an idea
  update: (id, updatedData) =>
    http.patch(`/${id}`, updatedData)
      .then(res => res.data)
      .catch(err => { throw err }),

  // Delete an idea
  delete: (id) =>
    http.delete(`/${id}`)
      .then(res => res.data)
      .catch(err => { throw err }),

  // Toggle like
  toggleLike: (id) =>
    http.patch(`/${id}/like`)
      .then(res => res.data.data)
      .catch(err => { throw err }),

  // Get All Likers
  getLikes: (ideaId) =>
    http.get(`/${ideaId}/likes`)
        .then(res => res.data.data)
        .catch(err => { throw err }),  

};

export default ideaService;
