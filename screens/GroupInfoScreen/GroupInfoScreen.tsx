import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Auth, DataStore } from "aws-amplify";
import { Message as MessageModel, ChatRoom, User, ChatRoomUser } from "../../src/models";
import UserItem from "../../components/UserItem";


const GroupInfoScreen = () => {
  const route = useRoute();
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchChatRoom();
    fetchUsers();
  }, []);



  const fetchChatRoom = async () => {
    if (!route.params?.id) {
      console.warn("No chatroom id provided");
      return;
    }
    const chatRoom = await DataStore.query(ChatRoom, route.params.id);
    if (!chatRoom) {
      console.error("Couldn't find a chat room with this id");
    } else {
      setChatRoom(chatRoom);
    }
  };

  const fetchUsers = async () => {
    const fetchedUsers = (await DataStore.query(ChatRoomUser))
      .filter(chatRoomUser => chatRoomUser.chatRoom.id === route.params?.id)
      .map(chatRoomUser => chatRoomUser.user);

    setAllUsers(fetchedUsers);
  };

  const confirmDelete = async (user) => {
    const authData = await Auth.currentAuthenticatedUser();
    if (chatRoom?.Admin?.id !== authData.attributes.sub) {
      Alert.alert("Вы не admin группы, удаление невозможно");
      return;
    }

    if (user.id === chatRoom?.Admin?.id) {
      Alert.alert("Вы admin группы, удаление самого себя невозможно");
      return;
    }
    Alert.alert(
      "Подтвердить удаление",
      `Вы уверены что хотите удалить ${user.name} из группы ?`,
      [
        {
          text: "Удалить",
          onPress: () => deleteUser(user),
          style: 'destructive',
        },
        {
          text: "Отмена"
        }
      ]
    )
  }

  const deleteUser = async (user) => {
    const chatRoomUsersToDelete = await (await DataStore.query(ChatRoomUser)).filter(cru => cru.chatRoom.id === chatRoom.id && cru.user.id === user.id);
    if (chatRoomUsersToDelete.length > 0) {
      await DataStore.delete(chatRoomUsersToDelete[0]);

      setAllUsers(allUsers.filter((u) => u.id !== user.id));
    }
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{chatRoom?.name}</Text>
      <Text style={styles.title}>Users({allUsers.length})</Text>
      <FlatList
        data={allUsers}
        renderItem={({ item }) =>
          <UserItem
            user={item}
            isAdmin={chatRoom?.Admin?.id === item.id}
            onLongPress={() => confirmDelete(item)}
          />}
      />


    </View>

  );

}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    padding: 10,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
});


export default GroupInfoScreen;