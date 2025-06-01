import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Notifications from '../../assets/api/Notifications';
import { 
  setNotifications, 
  addNotification, 
  updateNotification, 
  deleteNotification, 
  clearNotifications
} from '../Redux/slices/NotificationSlice';

export const useNotification = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.notifications);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all notifications
  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await Notifications.GetAll();
      if (response.success) {
        dispatch(setNotifications(response.data));
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  // Create new notification
  const createNotification = async (notificationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await Notifications.Create(notificationData);
      if (response.success) {
        dispatch(addNotification(response.data));
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      setError('Failed to create notification');
      return { success: false, message: 'Failed to create notification' };
    } finally {
      setLoading(false);
    }
  };

  // Update notification
  const updateNotificationData = async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await Notifications.Update(id, updatedData);
      if (response.success) {
        dispatch(updateNotification(response.data));
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      setError('Failed to update notification');
      return { success: false, message: 'Failed to update notification' };
    } finally {
      setLoading(false);
    }
  };

  // Delete notification
  const deleteOne = async (id) => {
    // setLoading(true);
    setError(null);
    try {
      const response = await Notifications.Delete(id);
      if (response.success) {
        dispatch(deleteNotification(id));
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      setError('Failed to delete notification');
      return { success: false, message: 'Failed to delete notification' };
    }
    // finally {
    //   setLoading(false);
    // }
  };

  // Get notification by ID
  const getNotificationById = (id) => {
    return notifications.find(notification => notification.id === id);
  };

  // Get recent notifications (last 10)
  const getRecent = () => {
    return notifications.slice(0, 10);
  };

  // Get notifications count
  const getCount = () => {
    return notifications.length;
  };

  const clearAll = async () => {
    // setLoading(true);
    setError(null);
    try {
      const response = await Notifications.DeleteAll();
      if (response.success) {
        dispatch(clearNotifications());
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      setError('Failed to delete all notifications');
      return { success: false, message: 'Failed to delete all notifications' };
    }
    // finally {
    //   setLoading(false);
    // }
  };

  return {
    notifications,
    loading,
    error,
    fetchAll,
    createNotification,
    updateNotificationData,
    deleteOne,
    getNotificationById,
    getRecent,
    getCount,
    clearAll,
  };
};