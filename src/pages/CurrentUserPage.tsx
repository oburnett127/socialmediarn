import React, { useContext } from 'react';
import { UserContext } from '../components/UserContext';
import PostsList from '../components/PostsList';
import NewPost from '../components/NewPost';
import { View, Text } from 'react-native';

function CurrentUserPage() {
  const userContext = useContext(UserContext);

  if (!userContext || !userContext.user) {
    return (
      <View>
          <Text>No user context available. If not logged in please log in.</Text>
      </View>
    );
  }

  const { user } = userContext;

  return (
    <>
      <NewPost profUID={user.id.toString()} />
      <PostsList id={user.id.toString()} />
    </>
  )
}

export default CurrentUserPage;
