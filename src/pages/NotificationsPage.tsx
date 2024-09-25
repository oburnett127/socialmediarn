import React, { useContext } from 'react';
import Notifications from '../components/Notifications';
import { View, Text } from 'react-native';
import { UserContext } from '../components/UserContext';

function NotificationsPage() {
  const userContext = useContext(UserContext);

  if (!userContext || !userContext.user) {
    return (
      <View>
          <Text>No user context available. If not logged in please log in.</Text>
      </View>
    );
  }

  return <Notifications />
}

export default NotificationsPage;
