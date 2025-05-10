import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:3000/api/comments', // Direct backend API
  withCredentials: true
});

const commentService = {
  // Fetch all comments for an idea
  getAllByIdea: (ideaId) =>
    http
      .get(`/idea/${ideaId}`)
      .then(res => res.data.data),

  // Create a new comment on an idea
  create: (ideaId, content) =>
    http
      .post(`/idea/${ideaId}`, { content })
      .then(res => res.data.data),

  // Update your own comment
  update: (commentId, content) =>
    http
      .patch(`/${commentId}`, { content })
      .then(res => res.data.data),

  // Toggle like/unlike on a comment
  toggleLike: (commentId) =>
    http
      .patch(`/${commentId}/like`)
      .then(res => res.data.data),

  // Delete your own comment
  delete: (commentId) =>
    http
      .delete(`/${commentId}`)
      .then(res => res.data.message),
};

export default commentService;
