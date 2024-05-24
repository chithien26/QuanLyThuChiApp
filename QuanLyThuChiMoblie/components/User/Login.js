import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import MyStyles from "../../styles/MyStyles";
import Style from "./Style";
import { endpoints } from '../../configs/APIs';
import APIs from '../../configs/APIs'; // Thêm import này
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login =() => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const DangNhapClick = async ()=> {
        const client_id = 'W54DfhPMIcoW4r11qdnTxXz53z9ypDfhqlRTFkIn';
        const client_secret = 'yL4g98Nd4omhd28tNS49omEsGr5VOczCVKpcVZuzZXFIAJ4BHZE9LRqibz645UYVXUo1YYbcLhKovp66BMB2k6TJaGm0R7qpTWyLkC6ZFNONHYSBK5e5zyH2KQSco4AS';
        const grant_type = 'password';
        const data = new URLSearchParams();
        data.append('client_id', client_id);
        data.append('client_secret', client_secret);
        data.append('grant_type', grant_type);
        data.append('username', username);
        data.append('password', password);
        console.log('Data:', data.toString());
        try {
            const res = await APIs.post(endpoints['token'],data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            if (res.status === 200) {
                const { access_token, refresh_token } = res.data;
                console.log('Access Token:', access_token);
                console.log('Refresh Token:', refresh_token);
                await AsyncStorage.setItem('access_token', access_token); // Lưu token
                await AsyncStorage.setItem('refresh_token', refresh_token);
                Alert.alert('Đăng nhập thành công', 'Chào mừng bạn quay lại');
                // Lưu token hoặc chuyển hướng sang trang khác tại đây
                navigation.navigate('Thu');
            } else {
                Alert.alert('Đăng nhập thất bại', 'Có lỗi xảy ra, vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Lỗi khi đăng nhập:', error);
            Alert.alert('Đăng nhập thất bại', 'Có lỗi xảy ra, vui lòng thử lại.');
        }
    };
           
    const DangKiClick = () => {
        // Xử lý khi bấm nút Đăng ký
        navigation.navigate('Register')
        console.log('Đăng ký');
    };

    return (
        <View style={MyStyles.container}>
            <Text style={MyStyles.subject}>Ứng dụng quản lý chi tiêu </Text>                           
                <View style={Style.formContainer}>
                    <TextInput
                        style={Style.input}
                        placeholder="Tên đăng nhập"
                        onChangeText={text => setUsername(text)}
                        value={username}
                    />
                    <TextInput
                        style={Style.input}
                        placeholder="Mật khẩu"
                        onChangeText={text => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                    />
                    <View style={Style.buttonRow}>
                        <TouchableOpacity 
                            style={Style.button} 
                            onPress={DangNhapClick}>
                            <Text style={Style.buttonText}>Đăng nhập</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={Style.button}
                            onPress={DangKiClick}>
                            <Text style={Style.buttonText}>Đăng ký</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
                
        </View>
    );
};

export default Login;
