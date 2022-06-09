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
  const { control, handleSubmit, watch } = useForm();

  const pwd = watch('password');
  const navigation = useNavigation();

  const onRegisterPressed = async (data) => {
    const { username, password, email, name } = data;
    try {
      const response = await Auth.signUp({
        username,
        password,
        attributes: { email, name, preferred_username: username },
      });
      navigation.navigate('ComfirmEmail', { username });
    } catch (e) {
      Alert.alert('Oops', e.message);
    }
  }

  const onForgotPasswordPress = () => {
    console.warn("onForgotPasswordPress");
  }

  const onSingUpPress = () => {
    console.warn("onSingUpPress");
    navigation.navigate('SignIn')
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Создание аккаунта</Text>
        <CustomInput
          name="name"
          control={control}
          placeholder="Имя"
          rules={{
            required: 'Требуется Имя',
            minLength: { value: 4, message: 'Поле Имя должно содержать минимум 4 символа' },
            maxLength: { value: 24, message: 'Поле Имя может содержать максимум 12 символов' }
          }}
        />
        <CustomInput
          name="username"
          control={control}
          placeholder="Имя пользователя"
          rules={{
            required: 'Требуется Имя пользователя',
            minLength: { value: 4, message: 'Поле Имя пользователя должно содержать минимум 4 символа' },
            maxLength: { value: 12, message: 'Поле Имя пользователя может содержать максимум 12 символов' }
          }}
        />
        <CustomInput
          name="email"
          control={control}
          placeholder="Email"
          rules={{
            required: 'Требуется Email',
            pattern: { value: EMAIL_REGEX, message: 'Ваш Email не действителен' },
          }}
        />
        <CustomInput
          name="password"
          control={control}
          placeholder="Пароль"
          secureTextEntry
          rules={{
            required: 'Требуется пароль',
            minLength: { value: 6, message: 'Пароль должен содержать минимум 6 символов ' }
          }}
        />
        <CustomInput
          name="repeat-password"
          control={control}
          placeholder="Повторите пароль"
          secureTextEntry
          rules={{
            validate: value =>
              value == pwd || 'Пароль не совпадает',
          }}
        />

        <CustomButton
          text="Зарегистрировать"
          onPress={handleSubmit(onRegisterPressed)}
        />
        <CustomButton
          text="У вас уже есть аккаунт? Войти"
          onPress={onSingUpPress}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    padding: 20,
  },

  logo: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
})

export default SignUpScreen