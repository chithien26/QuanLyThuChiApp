import React,{ useContext, useState, useEffect } from "react";
import { View, TouchableOpacity, ScrollView, Alert} from "react-native";
import { Button,  TextInput , Text, IconButton} from "react-native-paper";
import { MyDispatchContext, MyLoadSelfContext, MyUserContext } from "../../configs/Contexts";
import Styles from "./Styles";
import moment from "moment"; 
import DateTimePicker from "react-native-modal-datetime-picker";
import Dialog from "react-native-dialog"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { authApi, endpoints } from '../../configs/APIs';
import Profile from "../User/Profile";

const CaNhan = ({}) => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const [showThu, setShowThu] = useState(true); // State để điều khiển hiển thị phần tiền thu
    const [showChi, setShowChi] = useState(false); // State để điều khiển hiển thị phần tiền chi
    const [date, setDate] = useState(new Date()); // State lưu trữ ngày tháng năm hiện tại
    const [note, setNote] = useState(""); // State lưu trữ nội dung ghi chú
    const [name, setName] = useState("");
    const [showDate, setShowDate]= useState(false);
    const [amount, setAmount] = useState("");
    const [amountHienThi, setAmountHienThi] = useState("");
    const [categories, setCategories] = useState([]); // State để lưu danh sách danh mục
    const [loading, setLoading] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
     
    useEffect(() => {
        loadCategories(); 
      }, []);
      const loadCategories = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            console.log(token) ;
            const response = await authApi(token).get(endpoints['category']);
            console.log(response.data);             
          // Kiểm tra response từ API
          if (response.status===200) {            
            setCategories(response.data);
          } else {
            // Xử lý khi có lỗi từ API
            console.log('Lỗi khi gọi API lấy danh mục:', response.status);
          }
        } catch (error) {
          // Xử lý khi có lỗi trong quá trình gọi API
          console.error('Lỗi trong quá trình gọi API:', error);
        }
      };
      const addTransaction = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            console.log(token) ;
            const formattedDate = moment(date).format('YYYY-MM-DD');
            const requestData = {
                name: name,
                amount: amount,
                timestamp:formattedDate,
                description: note,
                transaction_category_id: selectedCategoryId,              
            };
            console.log(requestData)
            const response = await authApi(token).post(endpoints['addTransactionSelf'], requestData,{
                headers: {
                    'Content-Type': 'application/json',
                  },
            });
            if (response.status ===200){
                Alert.alert('Thêm khoản chi thành công');
                       
            }      
        } catch (error) {                
            console.error("Lỗi khi thêm khoản thu", error);
        }  
        setLoading(false);
    };
    const CreateDate = () => {
        // Logic to create a group with selectedUsers
        setShowDate(true); 
    };
    const ShowThu = () => {
        setShowThu(true);
        setShowChi(false);
    };
    const ShowChi = () => {
        setShowThu(false);
        setShowChi(true);
    };
    const handleDateChange = (selectedDate) => {
        setDate(selectedDate || date);
        setShowDate(false);
    };
    const NoteChange = (text) => {
        setNote(text);
    };
    const NameChange = (text) => {
        setName(text);
    };
    const formatAmount = (text) => {
        // Xóa các ký tự không phải số
        let cleaned = text.replace(/\D/g, '');
    
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
        setAmountHienThi(formatted);
        setAmount(cleaned);
      };
    
    
    
    const formatDate = (date) => {
        const formattedDate = moment(date).format("DD/MM/YYYY [(]ddd[)]");
        return formattedDate;
    };
    const CategoryClick = (categoryId) => {
        
        setSelectedCategoryId(categoryId);
       
    };
    return (
        <View style={{ flex: 1 }}>
            <View style={Styles.buttonView}>
                
                <Button
                    style={[Styles.buttonThu, showChi ? Styles.selectedCategoryButton : null]}
                    mode="contained"
                    onPress={ShowChi}
                >
                    Tiền chi
                </Button>
                <Button
                    style={[Styles.buttonThu, showThu ? Styles.selectedCategoryButton : null]}
                    mode="contained"
                    onPress={ShowThu}
                >
                    Tiền thu
                </Button>
            </View>           
                <View style={Styles.View}>
                    <Text style={[Styles.boldText,Styles.fontSizeView]}>Ngày:</Text>
                    <IconButton onPress={CreateDate} icon="calendar-month" size={20} />
                    <TouchableOpacity style={Styles.touChable} onPress={CreateDate}>
                       
                        <Text  style={[Styles.boldText,Styles.fontSizeView]}> {formatDate(date)}</Text>
                    </TouchableOpacity>
                </View>
                <View style={Styles.View}>
                    <Text style={[Styles.boldText,Styles.fontSizeView]}>Tên:</Text>
                    <TextInput style={Styles.textInput}
                        value={name}
                        onChangeText={NameChange}
                        placeholder="Nhập tên"
                        multiline={true}
                        numberOfLines={1}
                        />                   
                </View>
                <View style={Styles.View}>
                    <Text style={[Styles.boldText,Styles.fontSizeView]}>Ghi chú:</Text>
                    <TextInput style={Styles.textInput}
                        value={note}
                        onChangeText={NoteChange}
                        placeholder="Nhập ghi chú"
                        multiline={true}
                        numberOfLines={2}
                        />                   
                </View>
                <View style={Styles.View}>
                    <Text style={[Styles.boldText,Styles.fontSizeView]}>{showChi ? 'Tiền chi:' : 'Tiền thu:'}</Text>
                    <TextInput style={Styles.textInput}
                       value={amountHienThi}
                       onChangeText={formatAmount}
                       keyboardType="numeric" // Hiển thị bàn phím số
                       placeholder="Nhập số tiền (đồng)"                   
                        /> 
                </View>
                <View style={Styles.View}>
                            <Text style={[Styles.boldText,Styles.fontSizeView]}>Danh Mục:</Text>                  
                        </View>
                
            {showChi ? (
                <ScrollView style={{ flex: 1 }}>
                    <View>
                        <View style={Styles.categoryContainer}>
                            {categories.map((category) => (
                                category.transaction_type === 'expense' &&
                                <View key={category.id} style={Styles.categoryRow}>
                                    <Button
                                        style={[Styles.categoryButton, selectedCategoryId === category.id ? Styles.selectedCategoryButton : null]}
                                        mode="contained"
                                        contentStyle={{ flexDirection: 'column', alignItems: 'center' }}
                                        labelStyle={{ textAlign: 'center' }}
                                        onPress={() => CategoryClick(category.id)}
                                    >
                                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                            <IconButton icon="folder" size={20} />
                                            <Text style={{ textAlign: 'center', width: '100%' }} numberOfLines={3} ellipsizeMode="tail">{category.name}</Text>
                                        </View>
                                    </Button>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
                
            ) : (<ScrollView style={{ flex: 1 }}>
                    <View>
                        <View style={Styles.categoryContainer}>
                            {categories.map((category) => (
                                category.transaction_type === 'income' &&
                                <View key={category.id} style={Styles.categoryRow}>
                                    <Button
                                        style={[Styles.categoryButton, selectedCategoryId === category.id ? Styles.selectedCategoryButton : null]}
                                        mode="contained"
                                        contentStyle={{ flexDirection: 'column', alignItems: 'center' }}
                                        labelStyle={{ textAlign: 'center' }}
                                        onPress={() => CategoryClick(category.id)}
                                    >
                                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                            <IconButton icon="folder" size={20} />
                                            <Text style={{ textAlign: 'center', width: '100%' }} numberOfLines={3} ellipsizeMode="tail">{category.name}</Text>
                                        </View>
                                    </Button>
                                    
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>)}
            <DateTimePicker visible={showDate}
                    isVisible={showDate}
                    mode="date"
                    onConfirm={handleDateChange}
                    onCancel={() => setShowDate(false)}
                    date={date}
                />
            {showChi ? <Button onPress={addTransaction} style={Styles.btnThu} mode="contained">Nhập khoản chi</Button> 
            : <Button onPress={addTransaction} style={Styles.btnThu} mode="contained">Nhập khoản thu</Button>}          
        </View>
    );
}

export default CaNhan;