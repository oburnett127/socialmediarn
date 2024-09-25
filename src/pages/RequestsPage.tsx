import React, { useContext } from 'react';
import RequestsList from '../components/RequestsList'
import { UserContext } from '../components/UserContext';
import { View, Text } from 'react-native';

function RequestsPage() {
  const userContext = useContext(UserContext);

  if (!userContext || !userContext.user) {
    return (
      <View>
          <Text>No user context available. If not logged in please log in.</Text>
      </View>
    );
  }

  return <RequestsList />
}

export default RequestsPage;
