import React from 'react';
import { Platform, StatusBar, Text, View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { Auth } from 'aws-amplify';
//import { useRoute } from '@react-navigation/native';


import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const NewPasswordScreen = () => {
  // const route = useRoute();
   const {control, handleSubmit} = useForm();
  //   defaultValues: {username: route?.params?.username},
  // });

  //const username = watch('username');

  const navigation = useNavigation();
    
  const onSubmitPressed = async data => {
    try{
      await Auth.forgotPasswordSubmit(data.username, data.code, data.password);
      navigation.navigate('SingIn');
    } catch (e) {
      Alert.alert("Oops", e.message);
    }
  }

  const onResendPress = () => {
    console.warn("onResendPress");
  }

  const onSingInPress = () => {
    console.warn("onSingInPress");
    navigation.navigate('SignIn')
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Reset your password</Text> 
          <CustomInput 
            name="username"
            control={control}
            placeholder="Username" 
            rules={{
              required:'Code is required'
            }}
          />
          <CustomInput 
            name="code"
            control={control}
            placeholder="Code" 
            rules={{
              required:'Code is required'
            }}
          />
          <CustomInput 
            name="password"
            control={control}
            secureTextEntry
            placeholder="Enter your new password"
            rules={{
              required: 'Password is required', 
              minLength:{value:6, message:'Password should be minimum 6 characters '}
            }}
          />

          <CustomButton
            text="Submit"
            onPress={handleSubmit(onSubmitPressed)}
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

export default NewPasswordScreen