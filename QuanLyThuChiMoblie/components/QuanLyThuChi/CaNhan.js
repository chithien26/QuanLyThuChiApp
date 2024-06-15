import React,{ useContext, useState } from "react";
import { View, TouchableOpacity, ScrollView} from "react-native";
import { Button,  TextInput , Text, IconButton} from "react-native-paper";
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import Styles from "./Styles";
import moment from "moment"; 
import DateTimePicker from "react-native-modal-datetime-picker";
import Dialog from "react-native-dialog"; 

const CaNhan = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const [showThu, setShowThu] = useState(true); // State để điều khiển hiển thị phần tiền thu
    const [showChi, setShowChi] = useState(false); // State để điều khiển hiển thị phần tiền chi
    const [date, setDate] = useState(new Date()); // State lưu trữ ngày tháng năm hiện tại
    const [note, setNote] = useState(""); // State lưu trữ nội dung ghi chú
    const [showDate, setShowDate]= useState(false);
    const CreateDate = () => {
        // Logic to create a group with selectedUsers
        setShowDate(true); 
    }
    
    const handleShowThu = () => {
        setShowThu(true);
        setShowChi(false);
    }
    const handleDateChange = (selectedDate) => {
        setDate(selectedDate || date);
        setShowDate(false);
    };
    const handleNoteChange = (text) => {
        setNote(text);
    };
    const handleShowChi = () => {
        setShowThu(false);
        setShowChi(true);
    }
    const formatDate = (date) => {
        const formattedDate = moment(date).format("DD/MM/YYYY [(]ddd[)]");
        return formattedDate;
    };
    return (
        <View>
            <View style={Styles.buttonView}>
                <Button style={Styles.buttonThu}  mode="contained">Tiền thu</Button>
                <Button style={Styles.buttonThu}  mode="contained" >Tiền chi</Button>
            </View>
            <ScrollView>
                <View style={Styles.View}>
                    <Text style={[Styles.boldText,Styles.fontSizeView]}>Ngày:</Text>
                    <IconButton onPress={CreateDate} icon="calendar-month" size={20} />
                    <TouchableOpacity style={Styles.touChable} onPress={CreateDate}>
                       
                        <Text  style={[Styles.boldText,Styles.fontSizeView]}> {formatDate(date)}</Text>
                    </TouchableOpacity>
                </View>
                <View style={Styles.View}>
                    <Text style={[Styles.boldText,Styles.fontSizeView]}>Ghi chú:</Text>
                    <TextInput style={Styles.textInput}
                        value={note}
                        onChangeText={handleNoteChange}
                        placeholder="Nhập ghi chú"
                        multiline={true}
                        numberOfLines={2}
                        />
                   
                </View>
                
                    
               
                
                

                
               

               
                
                
            </ScrollView>
            <DateTimePicker visible={showDate}
                    isVisible={showDate}
                    mode="date"
                    onConfirm={handleDateChange}
                    onCancel={() => setShowDate(false)}
                    date={date}
                />
               
            
        </View>
    );
}

export default CaNhan;