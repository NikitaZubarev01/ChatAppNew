import React, { useState, useEffect } from "react";
import {
    View, 
    StyleSheet, 
    TextInput, 
    Pressable, 
    KeyboardAvoidingView, 
} from 'react-native';
import { DataStore, Auth } from "aws-amplify";
import { ChatRoom, Message } from '../../src/models';

import { SimpleLineIcons, Feather, MaterialCommunityIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import EmojiSelector from "react-native-emoji-selector";


const MessageInput = ({ chatRoom }) => {
    const [message,setMessage] = useState('');
    const [isEmojiPickerOpen, setIsEmajiPickerOpen] = useState(false);

    const sendMessage = async () => {
        //send message
        const user = await Auth.currentAuthenticatedUser();
        const newMessage = await DataStore.save(new Message({
            content: message,
            userID: user.attributes.sub,
            chatroomID: chatRoom.id,
        }))

    updateLastMessage(newMessage);

        setMessage('');
        setIsEmajiPickerOpen(false);
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
        if (message) {
            sendMessage();
        } else {
            onPlusClicked();
        }
    }
    
    return(
        <KeyboardAvoidingView style={[styles.root, {height: isEmojiPickerOpen ? '50%' : "auto"}]}>
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
                
                    <Feather name="camera" size={24} color='#595959' style={styles.icon} />
                    <MaterialCommunityIcons name="microphone-outline" size={24} color='#595959' style={styles.icon} />
                </View>

                <Pressable onPress={onPress} style={styles.buttonContainer}>
                    { message ? 
                    (<Ionicons name="send" size={18} color="white" /> 
                    ) : ( 
                    <AntDesign name="plus" size={24} color="white" /> )}
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

const styles = StyleSheet.create({
    root:{
        padding: 10,
    },
    inputContainer:{
        backgroundColor: 'lightgray',
        flex: 1,
        marginRight: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'lightgrey',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 5,
    },
    row:{
        flexDirection:'row',
    },
    buttonContainer:{
        width:40,
        height:40,
        backgroundColor: '#3777f0',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input:{
        flex:1,
        marginHorizontal:5,
    },
    icon:{
        marginHorizontal:5,
    },
    buttonText:{
        color:'white',
        fontSize:25,
    },
});



export default MessageInput;