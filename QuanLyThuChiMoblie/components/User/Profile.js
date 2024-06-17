import { useContext, useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { Button, Icon } from "react-native-paper";
import { MyDispatchContext, MyUserContext, TransactionContext} from "../../configs/Contexts";
import MyStyles from "../../styles/MyStyles";
import { useNavigation } from '@react-navigation/native';
import APIs, { authApi, endpoints } from '../../configs/APIs';
import Style from "./Style";
import { Avatar } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const Profile = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
   
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [transactions,setTransactions] = useState([]);
    const avatarUrl = user && user.avatar
    ? `https://res.cloudinary.com/chithien26/${user.avatar}`
    : null;
    const Refesh=()=>{
        
        loadSelf();
        
    }
    const Logout = () => {
        dispatch({ type: "logout" });
        navigation.navigate('Login');
    };
    useEffect(() => {
        loadSelf(); // Gọi loadSelf khi thành phần Profile được render
    }, []);
    const loadSelf = async () => {
      setLoading(true);
      try {
          const token = await AsyncStorage.getItem('token');
          const response = await authApi(token).get(endpoints['transactionSelf']);
          if (response.status === 200) {
            setTransactions(response.data)
            console.log(transactions)
          } else {
              console.log('Lỗi khi gọi API lấy danh sách giao dịch:', response.status);
          }
      } catch (error) {
          console.error('Lỗi trong quá trình gọi API:', error);
      }
      setLoading(false);
    };
    const formatDate = (date) => {
        const formattedDate = moment(date).format("DD/MM/YYYY [(]ddd[)]");
        return formattedDate;
    };
    const formatAmount = (text) => {
        let truncated = text.slice(0, -2);

        // Xóa các ký tự không phải số
        let cleaned = truncated.replace(/\D/g, '');
    
        // Đảo ngược chuỗi số để thêm dấu phẩy từ phải qua trái
        let reversed = cleaned.split('').reverse().join('');
    
        // Thêm dấu phẩy sau mỗi ba chữ số
        let formatted = '';
        for (let i = 0; i < reversed.length; i++) {
          if (i % 3 === 0 && i !== 0) {
            formatted += ',';
          }
          formatted += reversed[i];
        }
    
        // Đảo ngược lại để trở về trình tự ban đầu
        formatted = formatted.split('').reverse().join('');
    
        // Lưu giá trị đã được định dạng vào state
        return formatted;
      };
    return (
        
        <View style={[MyStyles.container, MyStyles.margin]}>
            
            {user ? (
                <View style={[Style.margin,Style.scrollview]}>
                    <View style={Style.userInfoContainer}>
                        <View style={Style.ColumnPicture} >
                            <Avatar.Image
                                source={{ uri: avatarUrl }}
                                resizeMode="cover"
                                style={Style.avatar}
                                size={150}
                                />
                                
                                <Button icon="camera-plus"> Cập nhật ảnh đại diện</Button>
                        </View>
                         
                        <View style={Style.Column}>
                            <Text style={Style.userName}>{user.last_name} {user.first_name} </Text>
                            <Text style={Style.userName}>{user.email}  </Text>
                            <Button icon="lead-pencil" onPress={Logout}>Cập nhật thông tin</Button>
                            <Button icon="logout" onPress={Logout}>Đăng xuất</Button>
                        </View>
                        
                    </View>
                    <View style={Style.detailContainer}>
                        <Text style={Style.userName}>Hoạt động gần đây </Text>
                        <Text>
                            <Button onPress ={Refesh} icon="autorenew">Refesh </Button>
                        </Text>
                    </View>
                    
                    <ScrollView style={Style.scrollview} >
                        <RefreshControl onRefresh={()=>loadSelf()}/>
                        <View style={[Style.container,Style.scrollview]}>
                        {transactions.slice().sort((a, b) => b.id - a.id).map((transaction) => (
                                    <View key={transaction.id} style={Style.transactionRow}>
                                        <TouchableOpacity style={Style.transactionContainer} >
                                            <View style={Style.transactionContent}>
                                                {/* Tên giao dịch */}
                                                <Text style={Style.transactionName}>{transaction.name}</Text>

                                                {/* Số tiền */}
                                                <View style={Style.detailContainer}>
                                                    <Text style={Style.detailLabel}>Số tiền:</Text>
                                                    <Text style={Style.detailText}>{formatAmount(transaction.amount)} đ</Text>
                                                </View>

                                                {/* Mô tả */}
                                                <View style={Style.detailContainer}>
                                                    <Text style={Style.detailLabel}>Mô tả:</Text>
                                                    <Text style={Style.detailText}>{transaction.description}</Text>
                                                </View>
                                            </View>
                                            
                                            {/* Thời gian */}
                                            <Text style={Style.timestamp}>{formatDate(transaction.timestamp)}</Text>
                                        </TouchableOpacity>
                                            
                                        
                                    </View>
                                ))}
                        </View>

                    </ScrollView>
                </View>
            ) : (
                <Text style={MyStyles.subject}>Loading...</Text>
            )}
        </View>        
    );
}
export default Profile;
