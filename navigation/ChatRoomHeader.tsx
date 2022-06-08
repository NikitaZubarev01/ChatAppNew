import React, { useEffect, useState } from "react";
import { Image, View, Text, useWindowDimensions,} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Auth, DataStore } from "aws-amplify";
import { ChatRoomUser, User } from "../src/models";

const ChatRoomHeader = ({ id, children }) => {
  const{width} = useWindowDimensions();
  const [user, setUser] = useState<User|null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }
  const fetchUsers = async () => {
    const fetchedUsers = (await DataStore.query(ChatRoomUser))
    .filter(chatRoomUser => chatRoomUser.chatRoom.id === id)
    .map(chatRoomUser => chatRoomUser.user);

    // setUsers(fetchedUsers);

     const authUser = await Auth.currentAuthenticatedUser(); 
    setUser(fetchedUsers.find(user => user.id !== authUser.attributes.sub) || null );
  };
  fetchUsers();
  }, []);

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
        source={{uri: user?.imageUri }}
        style={{width:35,height:35,borderRadius:30 }}
      />
      <Text style={{flex: 1, marginLeft: 10,fontWeight:'bold'}}>{user?.name}</Text>
      {/* <View style={{flexDirection:'row', paddingEnd:10}}>
        <Feather name="camera" size={24} color="black" style={{marginHorizontal: 10,}} />
        <Feather name="edit-2" size={24} color="black" style={{marginHorizontal: 10,}} />
      </View> */}
    </View>
  )
}; 

export default ChatRoomHeader;