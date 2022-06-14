import React from "react";
import { View, Pressable, Text } from "react-native";

import { FontAwesome } from '@expo/vector-icons';

import styles from "./styles"

const NewGroupButton = ({ onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
        <FontAwesome name="group" size={24} color="#595959" />
        <Text style={{ marginLeft: 10, fontWeight: 'bold', }}>New group</Text>
      </View>
    </Pressable>

  )
}

export default NewGroupButton;