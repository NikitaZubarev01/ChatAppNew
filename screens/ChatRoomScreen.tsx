import React from "react";
import { View, StyleSheet, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";

import Message from "../components/Message";
import ChatRoomData from '../assets/dummy-data/Chats';
import MessageInput from "../components/MessageInput";

export default function ChatRoomScreen() {

  const route = useRoute();
  const navigation = useNavigation();

  navigation.setOptions({title: 'Elon Musk'})

    return(
        <View style={styles.page}>
            <FlatList 
                data={ChatRoomData.messages}
                renderItem={({item}) => <Message message={item} />}
                inverted
            />
            <MessageInput/>
        </View>
    );
};

const styles= StyleSheet.create ({
    page:{
        backgroundColor:'white',
        flex: 1,
    },
    
})