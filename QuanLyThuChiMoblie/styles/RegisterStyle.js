import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        alignContent:"center", 
        justifyContent:"center",
        paddingBottom: 100,
        paddingTop: 0,
        padding: 20,

    }, 
    logo:{
        width:100,
        height:100,
        alignSelf:"center",
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "blue",
        alignSelf: "center",  
        margin: 20,
        marginTop:0
    },
    input: {
        marginBottom:20,
    },
    inputElement:{
        margin: 5,
    },
    buttonElement:{
        margin:5,
    },
});