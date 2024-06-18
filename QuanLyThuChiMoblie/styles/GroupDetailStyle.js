import { StyleSheet } from "react-native";


export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 25,   
        backgroundColor: '#FFFFFF',      
    },
    groupName: {
        fontSize: 22, // Kích thước chữ
        fontWeight: 'bold', // Độ đậm
        color: '#333', // Màu chữ       
        paddingVertical: 15, // Đệm dọc
        paddingHorizontal: 0, // Đệm ngang
        fontFamily: 'Roboto', // Font chữ
        shadowColor: '#000', // Màu đổ bóng
        shadowOffset: { width: 0, height: 2 }, // Độ dịch chuyển của bóng
        shadowOpacity: 0.3, // Độ mờ của bóng
        shadowRadius: 2, // Độ cong của bóng
        elevation: 3, // Độ độ cao của bóng (cho Android)
    },
    button: {
       
        backgroundColor:  '#FFFFFF', // Màu nền của button
        marginRight: 0, // Khoảng cách giữa button và groupName
    },
    row:{
        flexDirection: 'row',      
    },
    buttonType:{
        
        width: 150,
        marginBottom: 1, 
        backgroundColor: '#BBBBBB',
        
    },
    buttonView:{
       justifyContent:'center',
       alignItems:'center'
    }
});


