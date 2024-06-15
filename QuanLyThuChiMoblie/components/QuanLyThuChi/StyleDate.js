import { StyleSheet } from "react-native";

export default StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    datePickerHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        width: "100%",
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
    },
});
