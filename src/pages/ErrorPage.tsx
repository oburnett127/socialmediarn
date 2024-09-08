import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import PageContent from '../components/PageContent';

interface IError {
  status?: number;
  data?: {
    message?: string;
  };
}

function ErrorPage() {
  const route = useRoute();
  const error = route.params?.error as IError;

  let title = 'An error occurred!';
  let message = 'Something went wrong!';

  if (error?.status === 500) {
    message = error?.data?.message || 'Something went wrong!';
  }

  if (error?.status === 404) {
    title = 'Not found!';
    message = 'Could not find resource or page.';
  }

  return (
    <View style={styles.container}>
      <PageContent title={title}>
        <Text style={styles.message}>{message}</Text>
      </PageContent>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ErrorPage;
