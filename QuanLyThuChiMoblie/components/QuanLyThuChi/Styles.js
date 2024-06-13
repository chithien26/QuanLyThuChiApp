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
    },
});
