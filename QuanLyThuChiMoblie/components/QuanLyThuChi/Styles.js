import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },header: {
        fontSize: 16,
        color: 'white',
        backgroundColor: '#6200ee', // same color as button
        paddingVertical: 16,
        paddingHorizontal: 12,
        
        borderRadius: 4,
        overflow: 'hidden',
    },
    button: {
        width: '100%',
        marginTop: 20,
    },
    buttonContent: {
        height: 60, // Increase the height
        justifyContent: 'space-between',
        flexDirection: 'row-reverse', // To place ">" at the end
    },
    buttonLabel: {
        fontSize: 16,
    },searchSection: {
        marginTop: 20,
        flex:1,
    },
    searchInput: {
        marginBottom: 20,
    },
    userList: {
         flex:1,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    createGroupButton: {
        marginTop: 20,
    },
    avatar:{
        width:80,
        height:80,
        borderRadius:20
    },boldText: {
        fontWeight: 'bold',
    },headerContainer: {
        margin: 10,
    },fontSize:{
        fontSize: 16,
    },scrollView: {
        flex: 1,
        padding: 10,
    },
    groupButton: {
        backgroundColor: '#DDDDDD',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    groupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    groupIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    groupButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonView:{
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center', 
        
        backgroundColor: '#fff',
        paddingTop:50
    },
    buttonThu:{ 
        borderRadius:5,
        width:120,
        marginHorizontal:1,

    },
    input: {
        margin: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
      },
      datePicker: {
        margin: 20,
      },
      View:{
        flexDirection: 'row',       
        alignItems: 'center',        
        padding:5,
    }, fontSizeView:{
        fontSize:20,
    }, touChable:{
        backgroundColor:'#C0C0C0',
        flex: 1,
        alignItems: 'center',    
        padding:5,
    },  modalContainer: {
        backgroundColor: "white",
        padding: 20,
        margin: 50,
        borderRadius: 10,
        alignItems: "center",
      },textInput:{
        backgroundColor:'#C0C0C0',
        flex: 1,
        alignItems: 'center',    
        
    },
});
