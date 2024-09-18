import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import PageContent from '../components/PageContent';

interface IError {
  status?: number;
  data?: {
    message?: string;
  };
}

type ErrorPageRouteParams = {
  error: IError;
};

function ErrorPage() {
  const route = useRoute<RouteProp<{ ErrorPage: ErrorPageRouteParams}, 'ErrorPage'>>();
  const error = route.params?.error;

  let title = 'An error occurred!';
  let message = 'Something went wrong!';

  if (error?.status === 500) {
    message = error.data?.message || 'Something went wrong!';
  }

  if (error?.status === 404) {
    title = 'Not found!';
    message = 'Could not find resource or page.';
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ErrorPage;
