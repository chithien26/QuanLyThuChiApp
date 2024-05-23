import { StyleSheet } from "react-native";

export default StyleSheet.create({ 
    button: {
        backgroundColor: "#B0E0E6", // Màu nền của nút
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '50%',
        marginRight: 5,

    },
    buttonText: {
        color: "#8470FF", // Màu chữ của nút
        fontSize: 20,
        fontWeight: 'bold',
    }, 
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        fontSize: 18,
    },
    formContainer: {
        marginTop: 20,
        width: '80%',
    },  
    buttonRow: {
        flexDirection: 'row', // Đảm bảo các phần tử con được sắp xếp trên cùng một hàng
        justifyContent: 'space-between', // Các phần tử con được căn giữa và cách đều nhau
        marginTop: 10, // Khoảng cách giữa dòng button và các phần tử trên đó
    },
})