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
import { useNavigation } from '@react-navigation/native';

import UserItem from '../components/UserItem';
import Users from '../assets/dummy-data/Users';

export default function UsersScreen () {

  return (
    <View style={styles.page}>
      <FlatList 
        data={Users}
        renderItem={({ item }) => <UserItem user={item}/> }
        showsVerticalScrollIndicator={false}
      />
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