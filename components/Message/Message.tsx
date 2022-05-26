import React from "react";
import { View, Text, StyleSheet } from 'react-native';


const blue = '#3777f0';
const grey = 'lightgray'

const myID = 'u1';


const Message = ({ message }) => {

    const isMe = message.user.id == myID;

    return(
        <View style={[
            styles.container, isMe ? styles.rightcontainer : styles.leftcontainer]}>
            <Text style={{color: isMe ? 'black' : 'white'}}>{message.content}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        padding: 10,
        margin: 10,
        borderRadius: 10,
        Maxwidth: '75%',
    },
    leftcontainer:{
        backgroundColor:'#3777f0',
        marginLeft:10,
        marginRight:'auto',
    },
    rightcontainer:{
        backgroundColor:'lightgray',
        marginLeft:'auto',
        marginRight:10,
    },
});

export default Message;