import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:3000/api/notifications',
  withCredentials: true,
});

const notificationService = {
  handleError(err) {
    if (err.response) {
      return err.response.data || { message: 'Unknown server error' };
    } else if (err.request) {
      return { message: 'No response from server' };
    } else {
      return { message: err.message };
    }
  },

  getAllNotifications: () => {
    return http.get('/')
      .then(res => res.data)
      .catch(err => { throw notificationService.handleError(err); });
  },

  markAllAsRead: () => {
    return http.patch('/read-all')
      .then(res => res.data)
      .catch(err => { throw notificationService.handleError(err); });
  },

  markAsRead: (notificationId) => {
    return http.patch(`/${notificationId}/read`)
      .then(res => res.data)
      .catch(err => { throw notificationService.handleError(err); });
  },

  deleteNotification: (notificationId) => {
    return http.delete(`/delete/${notificationId}`)
      .then(res => res.data)
      .catch(err => { throw notificationService.handleError(err); });
  }
};

export default notificationService;
