import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SubmitHandler, useForm } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from './UserContext';
import { useNavigation } from '@react-navigation/native';

interface FormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const AuthForm: React.FC = () => {
  const navigation = useNavigation();
  const userContext = useContext(UserContext);
  if (!userContext) throw new Error("AuthForm must be used within a provider that provides UserContext");
  
  const { setUser, setIsLoggedIn } = userContext;
  const [isLogin, setIsLogin] = useState<'login' | 'signup'>('login');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, setValue } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      setMessage('');

      const authData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName
      };

      let url = isLogin === 'login'
        ? `${process.env.REACT_APP_SERVER_URL}/userinfo/login`
        : `${process.env.REACT_APP_SERVER_URL}/userinfo/signup`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authData),
      });

      if (isLogin !== 'login' && response.status === 409) {
        setMessage('The email address you entered is already taken. Please enter a different email.');
        throw new Error('The email address you entered is already taken. Please enter a different email.');
      }

      if (!response.ok) {
        setMessage('Log in or registration failed');
        throw new Error('Could not authenticate user.');
      }

      const resData = await response.json();
      const jwtToken = resData.token;

      await AsyncStorage.setItem('jwtToken', jwtToken);
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 2);
      await AsyncStorage.setItem('expiration', expiration.toISOString());

      setMessage('Log in or sign up was successful');
      setIsLoggedIn(true);

      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/userinfo/getuserbyemail/${data.email}`, {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          }
        });
        const user = await response.json();
        setUser(user);
      } catch (error: any) {
        console.error('Error fetching user:', error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleMode = () => {
    setMessage('');
    setIsLogin(isLogin === 'login' ? 'signup' : 'login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin === 'login' ? 'Log in' : 'Create a new user'}</Text>
      <Text style={styles.message}>{message}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={(text) => setValue('email', text)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setValue('password', text)}
      />

      {isLogin === 'signup' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            onChangeText={(text) => setValue('firstName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            onChangeText={(text) => setValue('lastName', text)}
          />
        </>
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleToggleMode}>
          <Text style={styles.linkText}>
            {isLogin === 'login' ? 'Create new user' : 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>{isSubmitting ? 'Submitting...' : 'Submit'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#007BFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AuthForm;
