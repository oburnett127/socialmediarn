import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { registerRootComponent } from 'expo';
import { UserProvider } from './src/components/UserContext';
import HomePage from './src/pages/HomePage';
import FriendsPage from './src/pages/FriendsPage';
import RequestsPage from './src/pages/RequestsPage';
import NotificationsPage from './src/pages/NotificationsPage';
import CurrentUserPage from './src/pages/CurrentUserPage';
import OtherUserPage from './src/pages/OtherUserPage';
import AuthenticationPage from './src/pages/AuthenticationPage';
import LogoutPage from './src/pages/LogoutPage';

export type RootDrawerParamList = {
    Home: undefined;
    HomeTabs: undefined;
    CurrentUser: undefined;
    OtherUserPage: { id: number };
    Auth: undefined;
    Logout: undefined;
    SearchUser: undefined;
    FriendsList: undefined;
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

function App() {
    return (
        <UserProvider>
            <NavigationContainer>
                <AppDrawer />
            </NavigationContainer>
        </UserProvider>
    );
}

export default registerRootComponent(App);
