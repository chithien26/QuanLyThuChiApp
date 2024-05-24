import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import APIs, { endpoints } from '../../configs/APIs';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null); // Hình ảnh sẽ được lưu dưới dạng base64
  const [account_type, setAccount_type]= useState('user')
  const navigation = useNavigation();
  
  const DangKi = async () => {
    try {     
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('email', email);
      formData.append('account_type', account_type);
      if (avatar) {
        formData.append('avatar', {
          uri: avatar,
          type: 'image/jpeg', // hoặc 'image/png'
          name: 'avatar.jpg', // hoặc 'avatar.png'
        });
      }
      const response = await APIs.post(endpoints['register'], formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 201) {
        Alert.alert('Đăng ký thành công', 'Bạn có thể đăng nhập bây giờ.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Đăng ký thất bại', 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      Alert.alert('Đăng ký thất bại', 'Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  const ChonAnhCLick = async () => {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      Alert.alert('Quyền truy cập bị từ chối', 'Bạn cần cấp quyền truy cập để chọn ảnh đại diện.');
      return;
    }
  
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!pickerResult.cancelled) {
      setAvatar(pickerResult.uri);
    }
  };
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Tài khoản"
        onChangeText={text => setUsername(text)}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Họ"
        onChangeText={text => setFirstName(text)}
        value={firstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Tên"
        onChangeText={text => setLastName(text)}
        value={lastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        value={email}
      />
      <TouchableOpacity style={styles.avatarButton} onPress={ChonAnhCLick}>
        <Text style={styles.avatarButtonText}>Chọn ảnh đại diện</Text>
      </TouchableOpacity>
      {avatar && <Image source={{ uri: `data:image/jpeg;base64,${avatar}` }} style={styles.avatar} />}
      <TouchableOpacity style={styles.registerButton} onPress={DangKi}>
        <Text style={styles.registerButtonText}>Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  avatarButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  avatarButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  registerButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginTop: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Register;
