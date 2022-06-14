import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import { Feather } from "@expo/vector-icons";

export default function UserItem({ user, onPress, isSelected, onLongPress, isAdmin = false }) {

	return (
		<Pressable onPress={onPress} onLongPress={onLongPress} style={styles.container}>
			<Image source={{ uri: user.imageUri }} style={styles.image} />
			<View style={styles.rightContainer}>
				<Text style={styles.name}>{user.name}</Text>
				{isAdmin && <Text>admin</Text>}
			</View>
			{isSelected !== undefined && (
				<Feather
					name={isSelected ? "check-circle" : "circle"}
					size={20}
					color="#595959"
				/>
			)}
		</Pressable>
	);
}