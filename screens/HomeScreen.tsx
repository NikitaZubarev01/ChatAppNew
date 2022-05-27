import React from 'react';
import { 
  Platform, 
  StatusBar, 
  StyleSheet, 
  View, 
  FlatList, 
  Text, 
  Pressable 
} from 'react-native';
import { Auth } from 'aws-amplify';
import { useNavigation } from '@react-navigation/native';

import ChatRoomItem from '../components/ChatRoomItem';
import chatRoomsData from '../assets/dummy-data/ChatsRoom';

const chatRoom1 = chatRoomsData[0];
const chatRoom2 = chatRoomsData[1];
const chatRoom3 = chatRoomsData[2];

export default function TabOneScreen () {
  const navigation = useNavigation();

  const logOut = () => {
    Auth.signOut();
  }
  
  return (
    <View style={styles.page}>
      <FlatList 
        data={chatRoomsData}
        renderItem={({ item }) => <ChatRoomItem chatRoom={item}/> }
        showsVerticalScrollIndicator={false}
      />
      <Pressable onPress={logOut}>
        <Text style={{width:'100%', textAlign:'center',color:'red',marginTop:'auto',marginVertical:20,fontSize:20}}>SignOut</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  maincontainer:{
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  page:{
    backgroundColor: 'white',
    flex: 1,
  },
})