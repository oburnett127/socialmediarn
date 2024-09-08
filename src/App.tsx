import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserProvider } from './components/UserContext';
import HomePage from './pages/HomePage';
import FriendsPage from './pages/FriendsPage';
import RequestsPage from './pages/RequestsPage';
import NotificationsPage from './pages/NotificationsPage';
import CurrentUserPage from './pages/CurrentUserPage';
import OtherUserPage from './pages/OtherUserPage';
import AuthenticationPage from './pages/AuthenticationPage';
import LogoutPage from './pages/LogoutPage';

// Create Drawer and Tab Navigators
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Create Tab Navigation for the main content
function MainTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomePage} />
            <Tab.Screen name="Friends" component={FriendsPage} />
            <Tab.Screen name="Requests" component={RequestsPage} />
            <Tab.Screen name="Notifications" component={NotificationsPage} />
        </Tab.Navigator>
    );
}

// Drawer Navigation
function AppDrawer() {
    return (
        <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="HomeTabs" component={MainTabs} options={{ title: 'Home' }} />
            <Drawer.Screen name="CurrentUser" component={CurrentUserPage} />
            <Drawer.Screen name="OtherUser" component={OtherUserPage} />
            <Drawer.Screen name="Auth" component={AuthenticationPage} />
            <Drawer.Screen name="Logout" component={LogoutPage} />
        </Drawer.Navigator>
    );
}

export default function App() {
    return (
        <UserProvider>
            <NavigationContainer>
                <AppDrawer />
            </NavigationContainer>
        </UserProvider>
    );
}