import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 25,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16, // Thêm padding ngang cho các thành phần bên trong
    },
    groupName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        paddingVertical: 2,
        fontFamily: 'Roboto',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
        marginBottom: 2, // Thêm margin dưới để tách biệt với các thành phần khác
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center', // Căn giữa các thành phần trong hàng
        marginBottom: 2, // Thêm margin dưới cho các hàng
    },
    button: {
        backgroundColor: '#FFFFFF',
        marginRight: 2, // Khoảng cách giữa button và groupName
        borderRadius: 8, // Bo tròn góc của button
        elevation: 5, // Độ nổi cho Android
    },
    buttonType: {
        width: 150,
        height:50,
        marginBottom: 2,
        backgroundColor: '#BBBBBB',
        borderRadius: 8,
        elevation: 3,
        marginHorizontal: 8, // Khoảng cách ngang giữa các button
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    bgButton: {
        backgroundColor: '#33FF66',
    },
    bgButton1: {
        backgroundColor: '#FF3333',
    },
    btNgang: {
        flex: 1, // Sử dụng flex để các nút canh chỉnh tối ưu
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
});
