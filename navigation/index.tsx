import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { 
  ColorSchemeName, 
  Text, 
  View, 
  Image, 
  useWindowDimensions, 
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Auth, Hub } from 'aws-amplify';

import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

import SignInScreen from '../src/screens/SignInScreen';
import SignUpScreen from '../src/screens/SignUpScreen';
import ComfirmEmailScreen from '../src/screens/ComfirmEmailScreen';
import ForgotPasswordScreen from '../src/screens/ForgotPasswordScreen';
import NewPasswordScreen from '../src/screens/NewPasswordScreen';

import ChatRoomScreen from '../screens/ChatRoomScreen';
import HomeScreen from '../screens/HomeScreen';
import UsersScreen from '../screens/UsersScreen';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
   const [user,setUser] = useState<undefined | null>(undefined);
  
  const checkUser = async () => {
     try {
      const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
      setUser(authUser);
     } catch (e) {
       setUser(null);
     }
  };
  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const listener = (data) => {
      if (data.payload.event === 'signIn' || data.payload.event === 'signOut') {
        checkUser();
      }
    }
    Hub.listen('auth', listener);
    return () => Hub.remove('auth',listener);
  }, [] )

  if (user === undefined){
    return(
      <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      {user ? (
        <>
        <Stack.Screen 
        name="Home" 
        component={ HomeScreen }
        options={{ 
          headerTitle: props => <HomeHeader/>}}
        />
        <Stack.Screen 
          name="UsersScreen" 
          component={UsersScreen}
          options={{
            title: "Users",
          }}
        />
        <Stack.Screen 
          name="ChatRoom" 
          component={ChatRoomScreen}
          options={{ 
            headerTitle: ChatRoomHeader, 
            headerBackTitleVisible: false,
          }}
        />
      </>
      ) : (
        <>
        <Stack.Screen 
          name="SignIn" 
          component={SignInScreen}
          options={{ headerShown:false}} 
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen}
          options={{ headerShown:false}} 
        />
        <Stack.Screen 
          name="ComfirmEmail" 
          component={ComfirmEmailScreen}
          options={{ headerShown:false}}  
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen}
          options={{ headerShown:false}}  
        />
        <Stack.Screen 
          name="NewPassword" 
          component={NewPasswordScreen} 
          options={{ headerShown:false}} 
        />
        </>
        )}
    </Stack.Navigator>
  );
}

const HomeHeader = (props) => {

  const{width} = useWindowDimensions();
  const navigation = useNavigation();

  return(
    <View 
      style={{
        flexDirection:'row', 
        justifyContent:'space-between',
        width, 
        right: 5,
        alignItems:'center'}}>
      <Image 
        source={{uri: 'https://sun9-23.userapi.com/s/v1/ig2/vNrqVq2PwEsuhrMbODZn-RH5LbmG226bNumzeXSwzNPoRmBH9WtZ9u67kJfB6nF-AsrgcZwXC8WUhGUDFe9VDhbi.jpg?size=1437x2160&quality=96&type=album' }}
        style={{width:35,height:35,borderRadius:30 }}
      />
      <Text style={{flex: 1, textAlign:'center', marginLeft: 40,fontWeight:'bold'}}>Home</Text>
      <View style={{flexDirection:'row', paddingEnd:15}}>
        <Feather name="camera" size={24} color="black" style={{marginHorizontal: 10,}} />
        <Pressable onPress={() => navigation.navigate('UsersScreen')}>
          <Feather name="edit-2" size={24} color="black" style={{marginHorizontal: 10,}} />
        </Pressable>
      </View>
    </View>
  )
} 
const ChatRoomHeader = (props) => {

  const{width} = useWindowDimensions();

  return(
    <View 
      style={{
        flexDirection:'row', 
        justifyContent:'space-between',
        width : width - 30,
        right:30,
        padding: 10,
        alignItems:'center'}}>
      <Image 
        source={{uri: 'https://sun9-23.userapi.com/s/v1/ig2/vNrqVq2PwEsuhrMbODZn-RH5LbmG226bNumzeXSwzNPoRmBH9WtZ9u67kJfB6nF-AsrgcZwXC8WUhGUDFe9VDhbi.jpg?size=1437x2160&quality=96&type=album' }}
        style={{width:35,height:35,borderRadius:30 }}
      />
      <Text style={{flex: 1, marginLeft: 10,fontWeight:'bold'}}>{props.children}</Text>
      <View style={{flexDirection:'row', paddingEnd:10}}>
        <Feather name="camera" size={24} color="black" style={{marginHorizontal: 10,}} />
        <Feather name="edit-2" size={24} color="black" style={{marginHorizontal: 10,}} />
      </View>
    </View>
  )
} 
