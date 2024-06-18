import { StyleSheet } from "react-native";


export default StyleSheet.create({
    container: {
        flex: 1,
        alignContent:"center", 
        padding: 15,
        justifyContent:"center",
        paddingBottom: 100,
        paddingTop: 0,
        backgroundColor: "#FFFFFF"
    }, 
    type: {
        justifyContent: "center",
        paddingTop: 20,
        marginTop: 30,
        flexWrap: "nowrap",
        flexDirection: "row",
    },
    button: {
       
        backgroundColor:  '#FFFFFF', // Màu nền của button
        marginRight: 0, // Khoảng cách giữa button và groupName
    },
    buttonType:{
        marginLeft: 10, 
        marginRight: 10, 
        width: 130,
        marginBottom: 1, 
        backgroundColor: '#BBBBBB',
    },
    ButtonSelect: {
        backgroundColor: '#FF9900',
    },
    input: {
        marginBottom:10,
    },
    inputElement: {
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-around", 
        alignItems: "center",
        padding: 7

    },
    title: {
        fontSize: 16, 
        fontWeight: "bold",
        width: 70, 
    },
    calendar: {
        alignItems: "center",
        backgroundColor: "#FFCC99",
        // paddingLeft: 40, 
        paddingTop: 5, 
        // paddingRight: 40, 
        paddingBottom: 5, 
        borderRadius: 7,
        flex: 1
    },
    textInput:{
        flex: 1, 
        backgroundColor: "#DDDDDD",
        borderRadius: 5, 
        height: 37, 
        fontSize: 15
    }, 
    inputNgay: {
        paddingTop: 0, 
        paddingBottom: 0
    }, 
    categoryContainer:{
        flexDirection: 'row',
        marginTop: 5,
        flexWrap: 'wrap', 
        justifyContent:"flex-start",
        marginLeft: 13
    },
    categoryItem:{
        height: 90, 
        width: 100, 
        backgroundColor: '#DDDDDD',
        borderRadius: 10,
        flex: 1, 
        margin: 5, 
        textAlign: "center"
    },
    categorySelect: {
        backgroundColor:"#FFCC99"
    }, 
    buttonAdd:{
        margin: 10,
        marginTop: 10, 
        padding: 2,
        backgroundColor: '#FF9900',
    }, 
    image: {
        width: 50,
        height: 50,
        marginTop: 5,
    },
});