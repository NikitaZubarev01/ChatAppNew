import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import { DataStore } from 'aws-amplify';
import { Auth } from 'aws-amplify';
import { ChatRoom, User, ChatRoomUser } from '../../src/models';

export default function UserItem({ user }) {
	const navigation = useNavigation();

	const onPress = async () => {
		// TODO if there is already a chat room between these 2 users 
		// then redirect to the existing chat room
		// otherwise, create a new chatroom with these users

		// create a chat room 
		const newChatRoom = await DataStore.save(new ChatRoom({ newMessage: 0 }));

		//connect authenticated user with the chat room 
		const authUser = await Auth.currentAuthenticatedUser();
		const dbUser = await DataStore.query(User, authUser.attributes.sub);
		await DataStore.save(new ChatRoomUser({
			user: dbUser,
			chatRoom: newChatRoom,
		}))

		//connect clicked user with the chat room 
		await DataStore.save(new ChatRoomUser({
			user,
			chatRoom: newChatRoom,
		}))

		navigation.navigate('ChatRoom', { id: newChatRoom.id });

	}

	return (
		<Pressable onPress={onPress} style={styles.container}>
			<Image source={{ uri: user.imageUri }} style={styles.image} />
			<View style={styles.rightContainer}>
				<View style={styles.row}>
					<Text style={styles.name}>{user.name}</Text>
				</View>
			</View>
		</Pressable>
	);
}