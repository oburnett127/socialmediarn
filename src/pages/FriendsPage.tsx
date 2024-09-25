import React, { useContext } from 'react';
import FriendsList from '../components/FriendsList';
import { View, Text } from 'react-native';
import { UserContext } from '../components/UserContext';

function FriendsPage() {
  const userContext = useContext(UserContext);

  if (!userContext || !userContext.user) {
    return (
      <View>
          <Text>No user context available. If not logged in please log in.</Text>
      </View>
    );
  }

  return <FriendsList />
}

export default FriendsPage;
