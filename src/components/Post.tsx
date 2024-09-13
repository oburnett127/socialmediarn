import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FlatList, TouchableOpacity, View, StyleSheet, Text, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PostProps {
  postInfo: {
    postId: string;
    authorUserId: string;
    text: string;
  };
}

interface Comment {
  commentId: string;
  userId: string;
  text: string;
}

interface Users {
  [key: string]: {
    firstName?: string;
    lastName?: string;
  };
}

interface IFormInput {
  commentText: string;
}

function Post({ postInfo }: PostProps) {
  const [makeReply, setMakeReply] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<Users>({});

  const userContext = useContext(UserContext);
  const user = userContext ? userContext.user : null;

  const { register, handleSubmit, setValue} = useForm<IFormInput>();
  const jwtToken = AsyncStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (!user) return null;
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/getbypost/${postInfo.postId}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          }
        });
        const commentsData = await response.json();
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setComments([]);
      }
    };

    fetchComments();
  }, [postInfo.postId, user, jwtToken]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!user) return null;
        const userIds = comments.map(comment => comment.userId);
        userIds.push(postInfo.authorUserId);
        const uniqueUserIds = [...new Set(userIds)];
    
        for (const userId of uniqueUserIds) {
          const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/userinfo/getuserbyuserid/${userId}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
            }
          });
          const userData = await response.json();
          setUsers(prevUsers => ({ ...prevUsers, [userId]: userData }));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers({});
      }
    };
    

    fetchUsers();
  }, [comments, postInfo.authorUserId, user, jwtToken]);

  if (!userContext || !user) return null;

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const requestData = {
        postId: postInfo.postId,
        userId: user.id,
        text: data.commentText
      };

      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(requestData),
      });

      const commentData = await response.json();
      setComments(prevComments => [...prevComments, commentData]);
      setMakeReply(false);
    } catch (error) {
      console.error('Error creating comment', error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.postUserInfo}>
          {users[postInfo.authorUserId]?.firstName} {users[postInfo.authorUserId]?.lastName}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.postText}>{postInfo.text}</Text>
      </View>

      <TouchableOpacity style={styles.replyButton} onPress={() => setMakeReply(true)}>
        <Text style={styles.buttonText}>Reply</Text>
      </TouchableOpacity>

      {makeReply && (
        <View style={styles.replyForm}>
          <TextInput
            style={styles.textInput}
            placeholder="Write a reply..."
            onChangeText={(text) => setValue("commentText", text)}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={comments}
        keyExtractor={(item) => item.commentId.toString()}
        renderItem={({ item: comment }) => (
          <View style={styles.commentContainer}>
            <Text style={styles.commentUserInfo}>
              {users[comment.userId]?.firstName} {users[comment.userId]?.lastName}
            </Text>
            <Text style={styles.commentText}>{comment.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  row: {
    marginBottom: 10,
  },
  postUserInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postText: {
    fontSize: 14,
    color: '#333',
  },
  replyButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  replyForm: {
    marginVertical: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  commentContainer: {
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  commentUserInfo: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 14,
    color: '#555',
  },
});

export default Post;
