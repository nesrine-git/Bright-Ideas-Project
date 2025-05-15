import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:3000/api/notifications',
  withCredentials: true,
});

const notificationService = {
  handleError(err) {
    if (err.response) {
      console.error('❌ Server error:', err.response);
      return err.response.data || { message: 'Unknown server error' };
    } else if (err.request) {
      console.error('❌ No response from server:', err.request);
      return { message: 'No response from server' };
    } else {
      console.error('❌ Error:', err.message);
      return { message: err.message };
    }
  },

  getAllNotifications: () => {
    console.log('📩 Fetching all notifications...');
    return http.get('/')
      .then(res => {
        console.log('✅ Notifications fetched successfully:', res.data);
        return res.data;
      })
      .catch(err => { 
        throw notificationService.handleError(err);
      });
  },

  markAllAsRead: () => {
    console.log('📩 Marking all notifications as read...');
    return http.patch('/read-all')
      .then(res => {
        console.log('✅ All notifications marked as read:', res.data);
        return res.data;
      })
      .catch(err => { 
        throw notificationService.handleError(err); 
      });
  },

 markAsRead: async (id) => {
  if (!id) {
    console.error('markAsRead called without id');
    return;
  }

  try {
    const response = await http.patch(`/${id}/read`);
    return response.data;
  } catch (error) {
    console.error('❌ Server error marking notification as read:', error.response || error);
    throw error;
  }
},

  deleteNotification: (notificationId) => {
    console.log(`🗑️ Deleting notification ${notificationId}...`);
    return http.delete(`/delete/${notificationId}`)
      .then(res => {
        console.log(`✅ Notification ${notificationId} deleted:`, res.data);
        return res.data;
      })
      .catch(err => { 
        throw notificationService.handleError(err);
      });
  }
};

export default notificationService;
