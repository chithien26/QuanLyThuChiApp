import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        alignContent:"center", 
        padding: 20,
        justifyContent:"center",
        paddingBottom: 100,
        paddingTop: 0,
    }, 
    logo:{
        width:100,
        height:100,
        alignSelf:"center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "blue",
        alignSelf: "center",  
        margin: 20,
    },
    input: {
        marginBottom:20,
    },
    inputElement:{
        margin: 10,
    },
    buttonElement:{
        margin:5,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 20
    }
});