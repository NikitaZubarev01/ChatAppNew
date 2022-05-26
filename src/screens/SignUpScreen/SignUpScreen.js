import React from 'react';
import { 
  Platform, 
  StatusBar, 
  Text, 
  View, 
  StyleSheet, 
  ScrollView, 
  Alert, 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { Auth } from 'aws-amplify';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const SignUpScreen = () => {
  const {control, handleSubmit, watch} = useForm();

  const pwd = watch('password');
  const navigation = useNavigation();

  const onRegisterPressed = async (data) => {
  const {username, password, email, name} = data;     
    try {
      const response = await Auth.signUp({
        username,
        password,
        attributes:{email, name, preferred_username: username},
      });
      navigation.navigate('ComfirmEmail', {username});
    }catch (e) {
      Alert.alert('Oops',e.message);
    }

  }

  const onForgotPasswordPress= () => {
    console.warn("onForgotPasswordPress");
  }

  const onSingUpPress = () => {
    console.warn("onSingUpPress");
    navigation.navigate('SignIn')
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Create an account</Text>
          <CustomInput 
            name="name"
            control={control}
            placeholder="Name" 
            rules={{
              required: 'Name is required',
              minLength:{value:4, message:'Name should be minimum 4 characters'},
              maxLength:{value:24, message:'Name should be max 12 characters'}
            }}
          />
          <CustomInput 
            name="username"
            control={control}
            placeholder="Username" 
            rules={{
              required: 'Username is required',
              minLength:{value:4, message:'Username should be minimum 4 characters'},
              maxLength:{value:12, message:'Username should be max 12 characters'}
            }}
          />
          <CustomInput 
            name="email"
            control={control}
            placeholder="Email"
            rules={{
              required: 'Email is required',
              pattern: {value: EMAIL_REGEX, message:'Email is invalid'},
            }}
          />
          <CustomInput 
            name="password"
            control={control}
            placeholder="Password" 
            secureTextEntry
            rules={{
              required: 'Password is required', 
              minLength:{value:6, message:'Password should be minimum 6 characters '}
            }}
          />
          <CustomInput 
            name="repeat-password"
            control={control}
            placeholder="Repeat Password" 
            secureTextEntry
            rules={{
              validate: value => 
              value == pwd || 'Password do not match',
            }}
          />

          <CustomButton
            text="Register"
            onPress={handleSubmit(onRegisterPressed)}
          />
          <CustomButton
            text="Have an account? Sign in"
            onPress={onSingUpPress}
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

export default SignUpScreen