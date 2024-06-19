import { StyleSheet } from "react-native";


export default StyleSheet.create({
    searchSection: {
        marginTop: 5,
        flex:1,
        
    },
    searchInput: { 
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#ffffff', // Màu nền của TextInput
        color: '#000000', // Màu chữ của TextInput
        placeholderTextColor: '#888888', // Màu chữ của placeholder
        
    },
    type: {
        justifyContent: "center",
        paddingTop: 20,
        marginTop: 30,
        flexWrap: "nowrap",
        flexDirection: "row",
    },
    buttonType:{
        marginLeft: 10, 
        marginRight: 10, 
        width: 130,
        marginBottom: 1, 
        backgroundColor: '#BBBBBB',
    },
    type1: {
        justifyContent: "center",
        
        flexWrap: "nowrap",
        flexDirection: "row",
    }
});