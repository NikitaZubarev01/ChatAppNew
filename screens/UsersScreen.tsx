import React, { useState, useEffect } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  FlatList,
  Pressable,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DataStore, Auth } from 'aws-amplify';
import { ChatRoom, User, ChatRoomUser } from '../src/models';

import UserItem from '../components/UserItem';
import NewGroupButton from '../components/NewGroupButton';


export default function UsersScreen() {
  const navigation = useNavigation();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isNewGroup, setisNewGroup] = useState(false);
  const [isMe, setIsMe] = useState<User | undefined>(undefined);

  useEffect(() => {
    DataStore.query(User).then(setUsers);
  }, [])

  // useEffect(() => {
  //   // query users
  //   const fetchUsers = async () => {
  //     const fetchedUsers = await DataStore.query(User);
  //     setUsers(fetchedUsers);
  //   };
  //   fetchUsers();
  // }, [] )

  const addUserToChatRoom = async (user, chatRoom) => {
    DataStore.save(
      new ChatRoomUser({ user, chatRoom })
    )
  }

  const createChatRoom = async (users) => {
    // TODO if there is already a chat room between these 2 users 
    // then redirect to the existing chat room
    // otherwise, create a new chatroom with these users

    //connect authenticated user with the chat room 
    const authUser = await Auth.currentAuthenticatedUser();
    const dbUser = await DataStore.query(User, authUser.attributes.sub);

    // create a chat room 
    const newChatRoomData = {
      newMessage: 0,
      admin: dbUser,
    };
    if (users.length > 1) {
      newChatRoomData.name = "New Group";
      newChatRoomData.imageUri = "https://img2.freepng.ru/20180717/cek/kisspng-computer-icons-desktop-wallpaper-team-concept-5b4e0cd3819810.4507019915318417475308.jpg";
    }
    const newChatRoom = await DataStore.save(new ChatRoom(newChatRoomData));


    if (dbUser) {
      await addUserToChatRoom(dbUser, newChatRoom)
    }


    //connect clicked users with the chat room
    await Promise.all(
      users.map((user) => addUserToChatRoom(user, newChatRoom))
    );

    navigation.navigate('ChatRoom', { id: newChatRoom.id });
  }

  const isUserSelected = (user) => {
    return selectedUsers.some((selectedUser) => selectedUser.id === user.id);
  }

  const onUserPress = async (user) => {
    if (isNewGroup) {
      if (isUserSelected(user)) {
        setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.id !== user.id))
      } else {
        setSelectedUsers([...selectedUsers, user]);
      }
    } else {
      await createChatRoom([user]);
    }
  }

  const saveGroup = async () => {
    await createChatRoom(selectedUsers);
  }

  return (
    <View style={styles.page}>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <UserItem
            user={item}
            onPress={() => onUserPress(item)}
            isSelected={isNewGroup ? isUserSelected(item) : undefined}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<NewGroupButton onPress={() => setisNewGroup(!isNewGroup)} />}
      />
      {isNewGroup && (
        <Pressable style={styles.button} onPress={saveGroup}>
          <Text style={styles.buttonText}>Save group ({selectedUsers.length})</Text>
        </Pressable>
      )}
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
  button: {
    backgroundColor: '#3872E9',
    marginHorizontal: 10,
    marginBottom: 20,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
})