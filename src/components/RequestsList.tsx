import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { UserContext } from './UserContext';
import { v4 as uuidv4 } from 'uuid';
import SearchUser from './SearchUser';
import AsyncStorage from '@react-native-async-storage/async-storage';

function RequestsList() {
  const userContext = useContext(UserContext);
  const user = userContext ? userContext.user : null;

  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [requestsIncomingUsers, setRequestsIncomingUsers] = useState<{ data: any[] }>({ data: [] });
  const [isLoadingIncoming, setIsLoadingIncoming] = useState(true);
  const [requestsOutgoingUsers, setRequestsOutgoingUsers] = useState<{ data: any[] }>({ data: [] });
  const [isLoadingOutgoing, setIsLoadingOutgoing] = useState(true);

  // Fetch JWT token from AsyncStorage
  useEffect(() => {
    const fetchJwtToken = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        setJwtToken(token);
      } catch (error) {
        console.error('Error fetching JWT token:', error);
      }
    };
    fetchJwtToken();
  }, []);

  const fetchIncomingRequests = async () => {
    if (!user) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/friend/getincomingrequests/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setRequestsIncomingUsers({ data: response.data });
      setIsLoadingIncoming(false);
    } catch (error) {
      console.error('Error fetching incoming friend requests:', error);
      setIsLoadingIncoming(false);
    }
  };

  const fetchOutgoingRequests = async () => {
    if (!user) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/friend/getoutgoingrequests/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setRequestsOutgoingUsers({ data: response.data });
      setIsLoadingOutgoing(false);
    } catch (error) {
      console.error('Error fetching outgoing friend requests:', error);
      setIsLoadingOutgoing(false);
    }
  };

  useEffect(() => {
    fetchIncomingRequests();
    fetchOutgoingRequests();
  }, [user, jwtToken]);

  const handleAcceptFriend = async (senderUserId: string) => {
    try {
      const requestData = {
        fromUserId: senderUserId,
        toUserId: user?.id,
      };

      await axios.post(`${process.env.REACT_APP_SERVER_URL}/friend/accept`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      fetchIncomingRequests();
      fetchOutgoingRequests();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const renderIncomingRequest = ({ item }: { item: any }) => (
    <View style={styles.listItem}>
      <Text>{item.firstName} {item.lastName}</Text>
      <Button title="Accept" onPress={() => handleAcceptFriend(item.id)} />
    </View>
  );

  const renderOutgoingRequest = ({ item }: { item: any }) => (
    <View style={styles.listItem}>
      <Text>{item.firstName} {item.lastName}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoadingIncoming ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.heading}>Incoming Friend Requests</Text>
          <FlatList
            data={requestsIncomingUsers.data}
            keyExtractor={() => uuidv4()}
            renderItem={renderIncomingRequest}
          />
        </>
      )}

      {isLoadingOutgoing ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.heading}>Outgoing Friend Requests</Text>
          <FlatList
            data={requestsOutgoingUsers.data}
            keyExtractor={() => uuidv4()}
            renderItem={renderOutgoingRequest}
          />
        </>
      )}

      <SearchUser />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default RequestsList;

