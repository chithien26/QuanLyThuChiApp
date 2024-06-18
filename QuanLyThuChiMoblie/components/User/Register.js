import React, { useState} from 'react';
import { View, Text, Alert, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { Button, HelperText, TextInput, TouchableRipple } from "react-native-paper";
import APIs, { endpoints } from '../../configs/APIs';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Style from './Style';
import MyStyles from '../../styles/MyStyles';
import RegisterStyle from '../../styles/RegisterStyle';

const Register = () => {
  const [user, setUser] = useState({account_type: 'user'});
  const [err, setErr] = useState(false);
  const fields = [{
    label: "Tên",
    icon: "text",
    field: "first_name"
  },{
    label: "Họ và tên lót",
    icon: "text",
    field: "last_name"
  },{
    label: "Địa chỉ Email",
    icon: "text",
    field: "email"
  },{
    label: "Tên đăng nhập",
    icon: "text",
    field: "username"
  },{
    label: "Mật khẩu",
    icon: "eye",
    field: "password",
    secureTextEntry: true
  },{
    label: "Xác nhận mật khẩu",
    icon: "eye",
    field: "confirm",
    secureTextEntry: true
  },
]
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
 

  const picker = async ()=>{
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted')
        Alert.alert("Lỗi", "Chưa cấp quyền truy cập!");
      else {
        let res = await ImagePicker.launchImageLibraryAsync();
        if (!res.canceled) {
            updateSate("avatar", res.assets[0]);
        }
      }
  }
  const updateSate = (field, value) => {
    setUser(current =>{
      return {...current,[field]: value}
    })
  }
  const removeAvatar = () => {
    setUser(current => {
      const newUser = { ...current };
      delete newUser.avatar;
      return newUser;
    });
  }
  
  const DangKi = async () => {
    if(user['password'] !== user['confirm'])
      setErr(true);
    else {
      setErr(false)
      
      try {     
       let form = new FormData();
        for(let f in user)
          if (f !== 'confirm')
            if ( f  === 'avatar')
              form.append(f, {
                uri: user.avatar.uri,
                name: user.avatar.fileName,
                type: user.avatar.type
            });
            else {
              form.append(f, user[f]);             
            }
      console.log(form)

      setLoading(true);        
      let response = await APIs.post(endpoints['register'], form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
        if (response.status === 201) {
          Alert.alert('Đăng ký thành công', 'Bạn có thể đăng nhập ngay bây giờ.');
          navigation.navigate('Login');
        } else {
          Alert.alert('Đăng ký thất bại', 'Có lỗi xảy ra, vui lòng thử lại.');
        }  
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
    } finally {
      setLoading(false);
    }
    };
  }
    

  return (
    <View style={RegisterStyle.container}>
      <KeyboardAvoidingView behavior={Platform.OS ==='ios' ? 'padding' : 'height'}>
        <ScrollView>
        <Text style={RegisterStyle.title}>Đăng kí</Text>
        <View style={RegisterStyle.input}>
          {fields.map(f=> <TextInput style={RegisterStyle.inputElement} key={f.field} label={f.label} onChangeText={t => updateSate(f.field,t)} secureTextEntry= {f.secureTextEntry} right={<TextInput.Icon icon={f.icon} />} />)}
        </View>
        <TouchableRipple style={Style.button} onPress={picker}>
          <Text style={Style.buttonText}>Chọn ảnh đại diện</Text>
        </TouchableRipple>
        {user.avatar && (
            <View style={[Style.avatarContainer, MyStyles.margin]}>
              <Image source={{ uri: user.avatar.uri }} style={MyStyles.avatar} />
              <TouchableOpacity style={Style.removeButton} onPress={removeAvatar}>
                <Text style={Style.removeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          )}
        <HelperText type="error" visible={err}>
          MẬT KHẨU KHÔNG KHỚP!
        </HelperText>


        <Button loading={loading} onPress={DangKi} icon="account" mode="contained" >ĐĂNG KÝ</Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
    
  );
};


export default Register;
