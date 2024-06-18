import React,{ useContext, useState, useEffect } from "react";
import { View, TouchableOpacity, ScrollView, Alert, RefreshControl,ActivityIndicator, ImageBackground, Image} from "react-native";
import { Button,  TextInput , Text, IconButton, Icon} from "react-native-paper";
import { MyDispatchContext, MyLoadSelfContext, MyUserContext } from "../../configs/Contexts";
import Styles from "./Styles";
import moment from "moment"; 
import DateTimePicker from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { authApi, endpoints } from '../../configs/APIs';
import CaNhanStyle from "../../styles/CaNhanStyle";
import { isCloseToBottom  } from "../Utils/Utils";

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
    const [page, setPage]= useState(1);

    useEffect(() => {
        loadCategories(); 
      }, [page]);
    const loadMore = ({nativeEvent}) => {
        if (loading===false && isCloseToBottom(nativeEvent) && page !==0) {
            setPage(page + 1);
            console.log(page)
        }
      }
    const loadCategories = async () => {
        if(page>0){
            let url = `${endpoints['category']}?page=${page}`
        try {
            setLoading(true);
            let token = await AsyncStorage.getItem('token');
            let res = await authApi(token).get(url);
            if (page === 1)
                setCategories(res.data.results);
            else if (page > 1)
                setCategories(current => {
                    return [...current, ...res.data.results]                        
                });            
            if (res.data.next === null)
                setPage(0);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);     
        }
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
            if (response.status ===201){
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
        <View style={CaNhanStyle.container}>
        <View style={CaNhanStyle.type}>
            <Button
                style={[CaNhanStyle.buttonType, showChi ? CaNhanStyle.ButtonSelect : null]}
                mode="contained"
                onPress={ShowChi}>
                Tiền chi
            </Button>
            <Button
                style={[CaNhanStyle.buttonType, showThu ? CaNhanStyle.ButtonSelect : null]}
                mode="contained"
                onPress={ShowThu}>
                Tiền thu
            </Button>
        </View>  
        <View style={CaNhanStyle.input}>         
            <View style={[CaNhanStyle.inputElement,CaNhanStyle.inputNgay]}>
                <Text style={CaNhanStyle.title}>Ngày:</Text>
                <IconButton onPress={CreateDate} icon="calendar-month" size={20} />
                <TouchableOpacity style={CaNhanStyle.calendar} onPress={CreateDate}>
                   
                    <Text  style={[Styles.boldText,Styles.fontSizeView]}> {formatDate(date)}</Text>
                </TouchableOpacity>
            </View>

            <View style={[CaNhanStyle.inputElement,CaNhanStyle.inputTen]}>
                <Text style={CaNhanStyle.title}>Tên</Text>
                <TextInput style={CaNhanStyle.textInput} 
                    value={name}
                    onChangeText={NameChange}
                    placeholder="Nhập tên"
                    multiline={true}
                    numberOfLines={1}
                    />                   
            </View>

            <View style={[CaNhanStyle.inputElement,CaNhanStyle.inputGhiChu]}>
                <Text style={CaNhanStyle.title}>Ghi chú</Text>
                <TextInput style={CaNhanStyle.textInput}
                    value={note}
                    onChangeText={NoteChange}
                    placeholder="Nhập ghi chú"
                    multiline={true}
                    numberOfLines={2}
                    />                   
            </View>
            <View style={[CaNhanStyle.inputElement,CaNhanStyle.inputTien]}>
                <Text style={CaNhanStyle.title}>{showChi ? 'Tiền chi' : 'Tiền thu'}</Text>
                <TextInput style={CaNhanStyle.textInput}
                   value={amountHienThi}
                   onChangeText={formatAmount}
                   keyboardType="numeric" // Hiển thị bàn phím số
                   placeholder="Nhập số tiền (đồng)"                   
                    /> 
            </View>
        </View>
            <View style={Styles.View}>
                        <Text style={[Styles.boldText,Styles.fontSizeView]}>Danh Mục:</Text>                  
                    </View>
                    {showChi ? (
                <ScrollView onScroll={loadMore}>
		<RefreshControl onRefresh={() => loadCategories()} />
                    {loading && <ActivityIndicator/>}
                    <View>
                        <View style={CaNhanStyle.categoryContainer}>
                            {categories.map((category) => (
                                category.transaction_type === 'expense' &&
                                <View key={category.id}>
                                      
                                      <Button
                                        style={[CaNhanStyle.categoryItem, selectedCategoryId === category.id ? CaNhanStyle.categorySelect : null]}
                                        mode="contained"
                                        contentStyle={{ flexDirection: 'column', alignItems: 'center' }}
                                        labelStyle={{ textAlign: 'center' }}
                                        onPress={() => CategoryClick(category.id)}
                                        >
                                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                            
                                            <Text style={{ textAlign: 'center', width: '100%' }} numberOfLines={3} ellipsizeMode="tail">{category.name}</Text>
                                            <Icon size={30} source={category.icon.slice(13)}/> 
                
                                
                                        </View>
                                    </Button>
                                </View>
                            ))}
                        </View>
                    </View>
		{loading && page > 1 && <ActivityIndicator/>} 
                </ScrollView>
                
            ) : (<ScrollView style={{ flex: 1 }} onScroll={loadMore}>
		    <RefreshControl onRefresh={() => loadCategories()} />
                {loading && <ActivityIndicator/>}
                    <View>
                        <View style={CaNhanStyle.categoryContainer}>
                            {categories.map((category) => (
                                category.transaction_type === 'income' &&
                                <View key={category.id}>
                                    <Button
                                        style={[CaNhanStyle.categoryItem, selectedCategoryId === category.id ? CaNhanStyle.categorySelect : null]}
                                        mode="contained"
                                        contentStyle={{ flexDirection: 'column', alignItems: 'center' }}
                                        labelStyle={{ textAlign: 'center' }}
                                        onPress={() => CategoryClick(category.id)}
                                    >
                                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                            
                                            <Text style={{ textAlign: 'center', width: '100%' }} numberOfLines={3} ellipsizeMode="tail">{category.name}</Text>
                                            <Icon size={30} source={category.icon.slice(13)}/> 
                                        </View>
                                    </Button>
                                    
                                </View>
                            ))}
                        </View>
                    </View>
		 {loading && page > 1 && <ActivityIndicator/>} 
                </ScrollView>)}
            <DateTimePicker visible={showDate}
                    isVisible={showDate}
                    mode="date"
                    onConfirm={handleDateChange}
                    onCancel={() => setShowDate(false)}
                    date={date}
                />
            {showChi ? <Button onPress={addTransaction} style={CaNhanStyle.buttonAdd} mode="contained">Nhập khoản chi</Button> 
            : <Button onPress={addTransaction} style={CaNhanStyle.buttonAdd} mode="contained">Nhập khoản thu</Button>}          
        </View>
    );
}

export default CaNhan;