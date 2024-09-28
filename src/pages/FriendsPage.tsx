import React, { useContext } from 'react';
import FriendsList from '../components/FriendsList';
import { View, Text } from 'react-native';
import { UserContext } from '../components/UserContext';

function FriendsPage() {
  return <FriendsList />
}

export default FriendsPage;
