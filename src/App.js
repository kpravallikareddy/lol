// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow strict-local
//  */

// import React from 'react';
// import type {Node} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// const Section = ({children, title}): Node => {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// };

// const App: () => Node = () => {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.js</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;


import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {View,BackHandler, Image,Text,Platform,Dimensions} from 'react-native';
import AppNavigator from 'navigators/app';

// //import BottomTabNavigator from "./src/navigation/tabNavigator";


 const App = () => {
  return (
    <NavigationContainer>
      
      <AppNavigator />
      
    </NavigationContainer>
  );
}
export default App;

//import React, { useContext } from 'react';
//import { createNativeStackNavigator } from 'react-native-screens/native-stack';
//import { createBottomTabNavigator,BottomTabBar } from '@react-navigation/bottom-tabs';
//import 'react-native-gesture-handler';
// import Tabs from 'navigators/tabs';
// import { createStackNavigator } from '@react-navigation/stack';
// import { NavigationContainer } from '@react-navigation/native';
//import { enableScreens } from 'react-native-screens';
// import { Splash1 } from '../../containers/Splash1';
// import { Splash } from '../../containers/Splash';
// import { Login } from '../../containers/Login';
// import { Splash1 } from './containers/Splash1';
// import { Splash } from './containers/Splash';
// import { Login } from './containers/Login';
// import Live from './containers/Live';
// import Profile from './containers/Profile';
// import Chat from './containers/Chat';
// import Contacts from './containers/Contacts';
// import Channelsearch from './containers/Channelsearch';
// import Searchchannel from './containers/Searchchannel';
// import Searchchatroom from './containers/Searchchatroom';
// import Searchsetting from './containers/Searchsetting';
// import Explore from './containers/Explore';

// import  Profile  from '../../containers/Profile';
// import Chat  from '../../containers/Chat';
// import Contacts  from '../../containers/Contacts';
// import Channelsearch  from '../../containers/Channelsearch';
// import Searchchannel  from '../../containers/Searchchannel';
// import Searchchatroom  from '../../containers/Searchchatroom';
// import Searchsetting  from '../../containers/Searchsetting';
// import Explore  from '../../containers/Explore';

// const Tab = createBottomTabNavigator();

// function MyTabs() {
//     return(
//     <Tab.Navigator>
//         <Tab.Screen name="Live" component={Live}/>
//         {/* <Tab.Screen name="Explore" component={Explore}/>
//         <Tab.Screen name="Chat" component={Chat}/>
//         <Tab.Screen name="Profile" component={Profile}/> */}
//     </Tab.Navigator>
//     );
// }

//enableScreens();
//const Stack = createNativeStackNavigator();
//  const Stack = createStackNavigator();

// function App() {
//     return (
//         <NavigationContainer>
//         <Stack.Navigator
//           initialRouteName="Splash1"
//         >  
//          {/* <Stack.Screen name="Tabs" component={Tabs} /> */}
//             <Stack.Screen name="Splash1" component={Splash1} />
//             <Stack.Screen name="Splash" component={Splash} />
//             <Stack.Screen name="Login" component={Login} />
//             {/* <Stack.Screen name="Live" component={MyTabs} /> */}
//             <Stack.Screen name="Live" component={Live} /> 
//             <Stack.Screen name="Profile" component={Profile} />
//             <Stack.Screen name="Chat" component={Chat} /> 
//             <Stack.Screen name="Contacts" component={Contacts} />
//             <Stack.Screen name="Channelsearch" component={Channelsearch} />
//             <Stack.Screen name="Searchchannel" component={Searchchannel} />
//             <Stack.Screen name="Searchchatroom" component={Searchchatroom} />
//             <Stack.Screen name="Searchsetting" component={Searchsetting} />
//             <Stack.Screen name="Explore" component={Explore} />
//         </Stack.Navigator>
//         </NavigationContainer>
//     );
// }

// export default App;

