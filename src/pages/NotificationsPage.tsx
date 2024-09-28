import React, { useContext } from 'react';
import Notifications from '../components/Notifications';
import { View, Text } from 'react-native';
import { UserContext } from '../components/UserContext';

function NotificationsPage() {
  return <Notifications />
}

export default NotificationsPage;
