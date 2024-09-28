import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { UserContext } from './UserContext';
import { RootDrawerParamList } from '../../App';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { isEmptyObject } from '../utils/helperfunctions';

interface Friend {
  id: number;
  firstName: string;
  lastName: string;
}

type FriendsListNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'FriendsList'>;

const FriendsList: React.FC = () => {
  const userContext = useContext(UserContext);
  const [friendsData, setFriendsData] = useState<Friend[] | null>(null);
  const navigation = useNavigation<FriendsListNavigationProp>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  console.debug("456");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        
        console.debug("test 567");
        console.debug(userContext);
        
        const { user } = userContext;

        console.log("test 185");
        console.debug(user);

        if (isEmptyObject(user)) {
          setErrorMessage('No user context available. If not logged in please log in 123. ');
          return; 
        }
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/friend/getbyuserid/${user.id}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        setFriendsData(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchData();
  }, [userContext]);

  const removeFriend = async (friendId: number) => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      const { user } = userContext;


      console.log(user);


      if (isEmptyObject(user)) {
        setErrorMessage('No user context available. If not logged in please log in.');
        return; 
      }
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/friend/delete`,
        { userId1: user.id, userId2: friendId },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setFriendsData((prevFriends) => prevFriends?.filter((friend) => friend.id !== friendId) || null);
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const navigateToProfile = (friendId: number) => {
    navigation.navigate('OtherUserPage', { id: friendId });
  };

  return (
    <View style={styles.container}>
      {errorMessage ? (
        <Text>{errorMessage}</Text>
      ) : friendsData ? (
        <>
          <Text style={styles.title}>Your Friends</Text>
          <FlatList
            data={friendsData}
            keyExtractor={(friend) => friend.id.toString()}
            renderItem={({ item: friend }) => (
              <View style={styles.friendContainer}>
                <TouchableOpacity onPress={() => navigateToProfile(friend.id)}>
                  <Text>{friend.firstName} {friend.lastName}</Text>
                </TouchableOpacity>
                <Button title="Remove Friend" onPress={() => removeFriend(friend.id)} />
              </View>
            )}
          />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
  },
  friendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default FriendsList;



// const FriendsList: React.FC = () => {
//   return (
//     <View>
//       <Text>Test: FriendsList component is rendering</Text>
//     </View>
//   );
// };

// export default FriendsList;
