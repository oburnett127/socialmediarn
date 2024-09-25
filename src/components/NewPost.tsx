import React, { useContext } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import axios from 'axios';
import { UserContext } from './UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, View, Text, TextInput } from 'react-native';

interface IFormInput {
  postText: string;
}

function NewPost({ profUID }: { profUID: string }) {
  const { control, register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const userContext = useContext(UserContext);
  const jwtToken = AsyncStorage.getItem('jwtToken');

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (!userContext || !userContext.user) {
      return (
        <View>
            <Text>No user context available. If not logged in please log in.</Text>
        </View>
    );
    }

    const formData = { authorUserId: userContext.user.id, profileUserId: profUID, text: data.postText };

    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + '/post/create', formData, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('Post created:', response.data);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (!userContext || !userContext.user) {
    return (<p>The form could not be generated. If not logged in please log in.</p>);
  }

  return (
    <View style={{ padding: 16 }}>
      <Controller
        name="postText"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={{
              height: 100,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 12,
              padding: 8,
            }}
            multiline
            placeholder="Write a new post..."
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.postText && <Text style={{ color: 'red' }}>This field is required.</Text>}

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default NewPost;
