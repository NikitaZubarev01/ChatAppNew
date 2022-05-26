import React from 'react';
import { Platform, StatusBar, Text, View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useRoute } from '@react-navigation/native';
import { Auth } from 'aws-amplify';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';


const ConfirmEmailScreen = () => {
    const route = useRoute();
    const {control, handleSubmit, watch} = useForm({
        defaultValues: {username: route?.params?.username},
    });

    const username = watch('username');

    const navigation = useNavigation();
    
    const onConfirmPressed = async (data) => {
        try{
          await Auth.confirmSignUp(data.username, data.code);
          navigation.navigate('SingIn');
        } catch (e) {
            Alert.alert("Oops", e.message);
        }
    }

    const onResendPress = async (data) => {
        try{
            await Auth.resendSignUp(data.username);
            Alert.alert('Success','Code was resent to your email');
        } catch (e) {
            Alert.alert("Oops", e.message);
        }
    }

    const onSingInPress = () => {
      console.warn("onSingInPress");

      navigation.navigate('SignIn');
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
            <Text style={styles.title}>Confirm your email</Text>

            <CustomInput 
              name="username"
              control={control}
              placeholder="Username" 
              rules={{
                  required:'Username is required'
              }}
            />
            <CustomInput 
              name="code"
              control={control}
              placeholder="Enter your confimation code" 
              rules={{
                  required:'Confirmation code is required'
              }}
            />

            <CustomButton
                text="Confirm"
                onPress={handleSubmit(onConfirmPressed)}
            />
            <CustomButton
                text="Resend code"
                onPress={onResendPress}
                type="SECONDARY"
            />
            <CustomButton
                text="Back to Sing in"
                onPress={onSingInPress}
                type="TERTIARY"
            />

        </View>
      </ScrollView>
    )
}

const styles = StyleSheet.create({
    root: {
        alignItems:"center",
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        padding: 20,
    },

    logo: {
        width: '70%',
        maxWidth: 300,
        maxHeight: 300,
    },
    title:{
        fontSize: 24,
        fontWeight:'bold',
        color:'#051C60',
        margin: 10,
    },
})

export default ConfirmEmailScreen