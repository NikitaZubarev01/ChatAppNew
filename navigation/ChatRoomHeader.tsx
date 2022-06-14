import React, { useEffect, useState } from "react";
import { Image, View, Text, useWindowDimensions, } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Auth, DataStore } from "aws-amplify";
import { ChatRoom, ChatRoomUser, User } from "../src/models";
import moment from "moment";

const ChatRoomHeader = ({ id, children }) => {
  const { width } = useWindowDimensions();
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [chatRoom, setChatRoom] = useState<ChatRoom | undefined>(undefined);

  const fetchUsers = async () => {
    const fetchedUsers = (await DataStore.query(ChatRoomUser))
      .filter(chatRoomUser => chatRoomUser.chatRoom.id === id)
      .map(chatRoomUser => chatRoomUser.user);

    setAllUsers(fetchedUsers);

    const authUser = await Auth.currentAuthenticatedUser();
    setUser(fetchedUsers.find(user => user.id !== authUser.attributes.sub) || null);
  };

  const fetchChatRoom = async () => {
    DataStore.query(ChatRoom, id).then(setChatRoom);
  }

  useEffect(() => {
    if (!id) {
      return;
    }

    fetchUsers();
    fetchChatRoom();
  }, []);



  const getLastOnlineText = () => {
    if (!user?.lastOnline) {
      return null;
    }
    // if lastOnline is less than 5 minutes ago, show him as online
    const lastOnlineDiffMS = moment().diff(moment(user.lastOnline))
    if (lastOnlineDiffMS < 5 * 60 * 1000) { //less than 5 minutes
      return "online";
    } else {
      return `Last seen online ${moment(user.lastOnline).fromNow()}`;
    }
  }

  const getUserNames = () => {
    return allUsers.map(user => user.name).join(', ');
  }

  const isGroup = allUsers.length > 2;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width - 30,
        right: 30,
        padding: 10,
        alignItems: 'center'
      }}>

      <Image
        source={{ uri: chatRoom?.imageUri || user?.imageUri }}
        style={{ width: 35, height: 35, borderRadius: 30 }}
      />

      <View style={{ flex: 1, marginLeft: 10, }}>
        <Text style={{ fontWeight: 'bold' }}>
          {chatRoom?.name || user?.name}
        </Text>
        <Text numberOfLines={1}>
          {isGroup ? getUserNames() : getLastOnlineText()}
        </Text>
      </View>
      {/* <View style={{flexDirection:'row', paddingEnd:10}}>
        <Feather name="camera" size={24} color="black" style={{marginHorizontal: 10,}} />
        <Feather name="edit-2" size={24} color="black" style={{marginHorizontal: 10,}} />
      </View> */}
    </View>
  )
};

export default ChatRoomHeader;