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

export type RootDrawerParamList = {
    Home: undefined;
    HomeTabs: undefined;
    CurrentUser: undefined;
    OtherUserPage: { id: string };
    Auth: undefined;
    Logout: undefined;
    SearchUser: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();
const Tab = createBottomTabNavigator();

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

function AppDrawer() {
    return (
        <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="HomeTabs" component={MainTabs} options={{ title: 'Home' }} />
            <Drawer.Screen name="CurrentUser" component={CurrentUserPage} />
            <Drawer.Screen name="OtherUserPage" component={OtherUserPage} />
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
