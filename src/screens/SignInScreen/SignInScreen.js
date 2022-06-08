import React, {useState} from 'react';
import { 
    Platform, 
    StatusBar,  
    View, 
    Image, 
    StyleSheet, 
    useWindowDimensions, 
    ScrollView,
    Alert, 
} from 'react-native';
import Logo from '../../../assets/images/Logo_1.png';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { Auth } from 'aws-amplify';
import { useForm, Controller } from 'react-hook-form';

const SignInScreen = () => {
    const navigation = useNavigation();

    const {height} = useWindowDimensions();

    const[loading, setLoading] = useState(false);

    const {control, handleSubmit, formState: {errors},} = useForm();

    
    const onSingInPressed = async (data) => {
        if (loading) {
            return;
        }

        setLoading(true);
        try{
            const response = await Auth.signIn(data.username, data.password);
            console.log(response);
        } catch(e) {
            Alert.alert('Oops', e.message);
        }
        setLoading(false);
    }

    const onForgotPasswordPress= () => {
        navigation.navigate('ForgotPassword');
    }

    const onSingUpPress = () => {
        navigation.navigate('SignUp');
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
            <Image 
              source ={Logo} 
              style={[styles.logo, {height: height * 0.3}]} 
              resizeMode="contain"
              />

            <CustomInput
              name="username"
              placeholder="Имя пользователя"
              control={control}
              rules={{required: 'Требуется имя пользователя'}}
             />
            <CustomInput 
              name="password"
              placeholder="Пароль"
              secureTextEntry
              control={control}
              rules={{
                  required: 'Требуестся пароль', 
                  minLength:{
                    value:6, 
                    message:'Пароль состоит минимум из 6 символов'
                  }
                }}
            /> 
            <CustomButton
                text={loading ? 'Загрузка...' : 'Вход' }
                onPress={handleSubmit(onSingInPressed)}
            />
            <CustomButton
                text="Забыли пароль ?"
                onPress={onForgotPasswordPress}
                type="TERTIARY"
            />  
             <CustomButton
                text="У вас нет аккаунта ? Создать аккаунт"
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
})

export default SignInScreen