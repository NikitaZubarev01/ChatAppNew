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
import { useForm } from 'react-hook-form';
import { Auth } from 'aws-amplify';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const ForgotPasswordScreen = () => {
  const { control, handleSubmit, } = useForm();

  const navigation = useNavigation();

  const onSendPressed = async data => {
    try {
      await Auth.forgotPassword(data.username);
      navigation.navigate('NewPassword');
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
        <Text style={styles.title}>Сбросить пароль</Text>

        <CustomInput
          name="username"
          control={control}
          placeholder="Имя пользователя"
          rules={{
            required: 'Требуется имя пользователя',
            minLength: { value: 4, message: 'Поле Имя пользователя должно содержать минимум 4 символа' },
            maxLength: { value: 12, message: 'Поле Имя пользователя может содержать максимум 12 символов' }
          }}
        />

        <CustomButton
          text="Отправить"
          onPress={handleSubmit(onSendPressed)}
        />
        <CustomButton
          text="Вернуться ко входу"
          onPress={onSingInPress}
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

export default ForgotPasswordScreen