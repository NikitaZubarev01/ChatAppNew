import React, { useState, useEffect } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  FlatList,
} from 'react-native';
import { DataStore } from 'aws-amplify';
import { User } from '../src/models';

import UserItem from '../components/UserItem';

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);

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

  return (
    <View style={styles.page}>
      <FlatList
        data={users}
        renderItem={({ item }) => <UserItem user={item} />}
        showsVerticalScrollIndicator={false}
      />
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