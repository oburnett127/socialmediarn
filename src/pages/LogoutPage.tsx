import React, { useContext } from 'react';
import { UserContext } from '../components/UserContext';
import { Text } from 'react-native';

function LogoutPage() {
  const userContext = useContext(UserContext);
  if (!userContext) return null;
  const { setIsLoggedIn } = userContext;
   
  localStorage.removeItem('jwtToken');
  setIsLoggedIn(false); 
  
  return (
    <Text style={{ textAlign: 'center'}}>You have successfully logged out</Text>
  )
}

export default LogoutPage;
