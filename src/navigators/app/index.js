import React, { useContext } from 'react';
//import { createNativeStackNavigator } from 'react-native-screens/native-stack';
//import { createBottomTabNavigator,BottomTabBar } from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
// import Tabs from 'navigators/tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { Splash1 } from '../../containers/Splash1';
import { Splash } from '../../containers/Splash';
import { Login } from '../../containers/Login';
import { Signup } from '../../containers/Signup';
import { Signin } from '../../containers/Signin';
import  Live  from '../../containers/Live';
import  Profile  from '../../containers/Profile';
import Chat  from '../../containers/Chat';
import Contact  from '../../containers/Contact';
import Channelsearch  from '../../containers/Channelsearch';
import Searchchannel  from '../../containers/Searchchannel';
import Searchchatroom  from '../../containers/Searchchatroom';
import Searchsetting  from '../../containers/Searchsetting';
import Explore  from '../../containers/Explore';
import Createroom  from '../../containers/Createroom';
import {Otp}  from '../../containers/Otp';
import Menu  from '../../containers/Menu';
import Createchannel  from '../../containers/Createchannel';
import Editprofile  from '../../containers/Editprofile';
import { Addfriends } from '../../containers/Addfriends';

enableScreens();
//const Stack = createNativeStackNavigator();
const Stack = createStackNavigator();

const App = () => {
    return (
        <>
        <Stack.Navigator
            screenOptions={{
            headerShown: false,
          }}
          initialRouteName="Splash1"
        >  
         {/* <Stack.Screen name="Tabs" component={Tabs} /> */}
            <Stack.Screen name="Splash1" component={Splash1} />
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Signin" component={Signin} />
            {/* <Stack.Screen name="Live" component={MyTabs} /> */}
            <Stack.Screen name="Live" component={Live} /> 
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Chat" component={Chat} /> 
            <Stack.Screen name="Contact" component={Contact} />
            <Stack.Screen name="Channelsearch" component={Channelsearch} />
            <Stack.Screen name="Searchchannel" component={Searchchannel} />
            <Stack.Screen name="Searchchatroom" component={Searchchatroom} />
            <Stack.Screen name="Searchsetting" component={Searchsetting} />
            <Stack.Screen name="Explore" component={Explore} />
            <Stack.Screen name="Otp" component={Otp} />
            <Stack.Screen name="Createroom" component={Createroom} />
            <Stack.Screen name="Menu" component={Menu} /> 
            <Stack.Screen name="Createchannel" component={Createchannel} />
            <Stack.Screen name="Editprofile" component={Editprofile} />
            <Stack.Screen name="Addfriends" component={Addfriends} />
            {/* <Stack.Screen name="Luckywheel" component={Luckywheel} /> */}
        </Stack.Navigator>
         </> 
    );
};

export default App;
