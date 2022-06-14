import React, { useState, useEffect } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  FlatList,
  Text,
  Pressable
} from 'react-native';
import { Auth, DataStore } from 'aws-amplify';
import { ChatRoom, ChatRoomUser } from '../src/models';

import ChatRoomItem from '../components/ChatRoomItem';

export default function TabOneScreen() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      const userData = await Auth.currentAuthenticatedUser();
      const chatRooms = (await DataStore.query(ChatRoomUser))
        .filter(chatRoomUser => chatRoomUser.user.id === userData.attributes.sub)
        .map(chatRoomUser => chatRoomUser.chatRoom);
      setChatRooms(chatRooms);
    };
    fetchChatRooms();
  }, []);

  const logOut = async () => {
    //await DataStore.clear()
    Auth.signOut();
  }

  return (
    <View style={styles.page}>
      <FlatList
        data={chatRooms}
        renderItem={({ item }) => <ChatRoomItem chatRoom={item} />}
        showsVerticalScrollIndicator={false}
      />
      <Pressable onPress={logOut}>
        <Text style={{ width: '100%', textAlign: 'center', color: 'red', marginTop: 'auto', marginVertical: 20, fontSize: 20 }}>SignOut</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  page: {
    backgroundColor: 'white',
    flex: 1,
  },
})