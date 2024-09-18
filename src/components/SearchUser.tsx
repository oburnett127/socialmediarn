import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../../App';

interface IUser {
  id: number;
  firstName: string;
  lastName: string;
}

type SearchUserNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'SearchUser'>;

function SearchUser() {
  const navigation = useNavigation<SearchUserNavigationProp>();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<IUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

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

  useEffect(() => {
    if (!searchQuery || !jwtToken) return;

    const fetchData = async () => {
      try {
        const response = await axios.get<IUser[]>(
          `${process.env.REACT_APP_SERVER_URL}/userinfo/getusersbyname/${encodeURIComponent(searchQuery)}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setData(response.data);
      } catch (err) {
        setError('Error fetching users');
        console.error('Error fetching users:', err);
      }
    };

    fetchData();
  }, [searchQuery, jwtToken]);

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setError('The user\'s name is required.');
      return;
    }
    setError(null);
    setSearchQuery(searchQuery);
  };

  const renderItem = ({ item }: { item: IUser }) => (
    <TouchableOpacity onPress={() => navigation.navigate('OtherUserPage', { id: item.id })}>
      <View style={styles.userItem}>
        <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Search Users</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter user name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Button title="Search" onPress={handleSearch} />

      {data && (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

// Example of styles
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userName: {
    fontSize: 18,
  },
});

export default SearchUser;
