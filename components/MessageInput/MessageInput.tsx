import React, { useState, useEffect } from "react";
import {
	View,
	TextInput,
	Pressable,
	KeyboardAvoidingView,
	Platform,
	Image,
	Text,
} from 'react-native';
import { DataStore, Auth, Storage } from "aws-amplify";
import { ChatRoom, Message } from '../../src/models';

import {
	SimpleLineIcons,
	Feather,
	MaterialCommunityIcons,
	AntDesign,
	Ionicons,
	FontAwesome
} from '@expo/vector-icons';
import EmojiSelector from "react-native-emoji-selector";
import * as ImagePicker from 'expo-image-picker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Audio } from "expo-av";
import { stat } from "fs";
import AudioPlayer from "../AudioPlayer";
import styles from "./styles";
import MessageComponent from "../Message";


const MessageInput = ({ chatRoom, messageReplyTo, removeMessageReplyTo }) => {
	const [message, setMessage] = useState('');
	const [isEmojiPickerOpen, setIsEmajiPickerOpen] = useState(false);
	const [image, setImage] = useState<string | null>(null);
	const [progress, setProgress] = useState(0);
	const [recording, setRecording] = useState<Audio.Recording | null>(null);
	const [soundURI, setSoundURI] = useState<string | null>(null);
	useEffect(() => {
		(async () => {
			if (Platform.OS !== "web") {
				const libraryResponse =
					await ImagePicker.requestMediaLibraryPermissionsAsync();
				const photoResponse = await ImagePicker.requestCameraPermissionsAsync();
				await Audio.requestPermissionsAsync();

				if (
					libraryResponse.status !== "granted" ||
					photoResponse.status !== "granted"
				) {
					alert("Sorry, we need camera roll permissions to make this work!");
				}
			}
		})();
	}, []);

	const sendMessage = async () => {
		//send message
		const user = await Auth.currentAuthenticatedUser();
		const newMessage = await DataStore.save(
			new Message({
				content: message,
				userID: user.attributes.sub,
				chatroomID: chatRoom.id,
				status: "SENT",
				replyToMessageID: messageReplyTo?.id,
			}))

		updateLastMessage(newMessage);

		resetFields();
	}

	const updateLastMessage = async (newMessage) => {
		DataStore.save(ChatRoom.copyOf(chatRoom, updatedChatRoom => {
			updatedChatRoom.LastMessage = newMessage;
		}))
	}

	const onPlusClicked = () => {
		console.warn("On Plus Clicked ");
	}

	const onPress = () => {
		if (image) {
			sendImage();
		} else if (message) {
			sendMessage();
		} else if (soundURI) {
			sendAudio();
		} else {
			onPlusClicked();
		}
	};

	const resetFields = () => {
		setMessage('');
		setIsEmajiPickerOpen(false);
		setImage(null);
		setProgress(0);
		setSoundURI(null);
		removeMessageReplyTo(null);
	}

	//Image picker
	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.cancelled) {
			setImage(result.uri);
		}
	};

	const takePhoto = async () => {
		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			aspect: [4, 3],
		})

		if (!result.cancelled) {
			setImage(result.uri);
		}
	}

	const progressCallback = (progress) => {
		setProgress(progress.loaded / progress.total)
	}

	const sendImage = async () => {
		if (!image) {
			return;
		}
		const blob = await getBlob(image);
		const { key } = await Storage.put(`${uuidv4()}.png`, blob, { progressCallback });

		//send message
		const user = await Auth.currentAuthenticatedUser();
		const newMessage = await DataStore.save(
			new Message({
				content: message,
				image: key,
				userID: user.attributes.sub,
				chatroomID: chatRoom.id,
				replyToMessageID: messageReplyTo?.id,
			})
		);

		updateLastMessage(newMessage);

		resetFields();
	};

	const getBlob = async (uri: string) => {
		const respone = await fetch(uri);
		const blob = await respone.blob();
		return blob;
	};

	// Audio
	async function startRecording() {
		try {
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
			});

			console.log("Starting recording..");
			const { recording } = await Audio.Recording.createAsync(
				Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
			);
			setRecording(recording);
			console.log("Recording started");
		} catch (err) {
			console.error("Failed to start recording", err);
		}
	}

	async function stopRecording() {
		console.log("Stopping recording..");
		if (!recording) {
			return;
		}

		setRecording(null);
		await recording.stopAndUnloadAsync();
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
		});

		const uri = recording.getURI();
		console.log("Recording stopped and stored at", uri);
		if (!uri) {
			return;
		}
		setSoundURI(uri);
	}

	const sendAudio = async () => {
		if (!soundURI) {
			return;
		}
		const uriParts = soundURI.split(".");
		const extenstion = uriParts[uriParts.length - 1];
		const blob = await getBlob(soundURI);
		const { key } = await Storage.put(`${uuidv4()}.${extenstion}`, blob, {
			progressCallback,
		});

		// send message
		const user = await Auth.currentAuthenticatedUser();
		const newMessage = await DataStore.save(
			new Message({
				content: message,
				audio: key,
				userID: user.attributes.sub,
				chatroomID: chatRoom.id,
				status: "SENT",
				replyToMessageID: messageReplyTo?.id,
			})
		);

		updateLastMessage(newMessage);

		resetFields();
	};

	return (
		<KeyboardAvoidingView style={[styles.root, { height: isEmojiPickerOpen ? '50%' : "auto" }]}>
			{messageReplyTo && (
				<View style={{
					backgroundColor: '#f2f2f2',
					padding: 5,
					flexDirection: 'row',
					alignItems: 'stretch',
					justifyContent: 'space-between'
				}}
				>
					<View style={{ flex: 1 }}>
						<Text>Reply to:</Text>
						<MessageComponent message={messageReplyTo} />
					</View>
					<Pressable onPress={() => removeMessageReplyTo()}>
						<FontAwesome
							name="close"
							size={16}
							color="black"
							style={{ margin: 5 }}
						/>
					</Pressable>
				</View>
			)}

			{image && (
				<View style={styles.sendImageContainer}>
					<Image
						source={{ uri: image }}
						style={{ width: 100, height: 100, borderRadius: 10, }}
					/>

					<View
						style={{
							flex: 1,
							justifyContent: "flex-start",
							alignSelf: "flex-end",
						}}
					>
						<View
							style={{
								height: 3,
								backgroundColor: '#3777f0',
								width: `${progress * 100}%`
							}}
						/>
					</View>

					<Pressable onPress={() => setImage(null)}>
						<FontAwesome
							name="close"
							size={24}
							color="black"
							style={{ margin: 5 }}
						/>
					</Pressable>
				</View>
			)}

			{soundURI && <AudioPlayer soundURI={soundURI} />}

			<View style={styles.row}>
				<View style={styles.inputContainer}>
					<Pressable onPress={() => setIsEmajiPickerOpen((currentValue) => !currentValue)}>
						<SimpleLineIcons
							name="emotsmile"
							size={24}
							color='#595959'
							style={styles.icon}
						/>
					</Pressable>

					<TextInput
						style={styles.input}
						onChangeText={setMessage}
						value={message}
						placeholder="Type message..."
					/>
					<Pressable onPress={pickImage}>
						<Feather
							name="image"
							size={24}
							color='#595959'
							style={styles.icon}
						/>
					</Pressable>
					<Pressable onPress={takePhoto}>
						<Feather
							name="camera"
							size={24}
							color='#595959'
							style={styles.icon}
						/>
					</Pressable>
					<Pressable onPressIn={startRecording} onPressOut={stopRecording}>
						<MaterialCommunityIcons
							name={recording ? "microphone" : "microphone-outline"}
							size={24}
							color={recording ? "red" : "#595959"}
							style={styles.icon}
						/>
					</Pressable>

				</View>

				<Pressable onPress={onPress} style={styles.buttonContainer}>
					{message || image || soundURI ?
						(<Ionicons name="send" size={18} color="white" />
						) : (
							<AntDesign name="plus" size={24} color="white" />)}
				</Pressable>
			</View>

			{isEmojiPickerOpen && (
				<EmojiSelector
					onEmojiSelected={emoji =>
						setMessage(currentMessage => currentMessage + emoji)
					}
					columns={8}
				/>
			)}
		</KeyboardAvoidingView>
	)
};

export default MessageInput;