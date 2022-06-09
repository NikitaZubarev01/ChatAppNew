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
  const { control, handleSubmit } = useForm();
  //   defaultValues: {username: route?.params?.username},
  // });

  //const username = watch('username');

  const navigation = useNavigation();

  const onSubmitPressed = async data => {
    try {
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
        <Text style={styles.title}>Сбросить пароль</Text>
        <CustomInput
          name="username"
          control={control}
          placeholder="Имя пользователя"
          rules={{
            required: 'Требуется имя пользователя'
          }}
        />
        <CustomInput
          name="code"
          control={control}
          placeholder="Код подтверждения"
          rules={{
            required: 'Требуется код подтверждения'
          }}
        />
        <CustomInput
          name="password"
          control={control}
          secureTextEntry
          placeholder="Введите ваш новый пароль"
          rules={{
            required: 'Требуется пароль',
            minLength: { value: 6, message: 'Пароль должен состоять минимум из 6 символов' }
          }}
        />

        <CustomButton
          text="Отправить"
          onPress={handleSubmit(onSubmitPressed)}
        />
        <CustomButton
          text="Отправить код еще раз"
          onPress={onResendPress}
          type="SECONDARY"
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

export default NewPasswordScreen