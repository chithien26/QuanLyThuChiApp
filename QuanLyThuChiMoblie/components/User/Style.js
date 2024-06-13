import { StyleSheet } from "react-native";

export default StyleSheet.create({ 
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },

});