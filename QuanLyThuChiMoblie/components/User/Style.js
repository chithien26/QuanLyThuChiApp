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
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginRight: 10,
    
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 7,
  },margin:{
    marginTop:20,
  },
  Column: {
    width:150,
    flexDirection: 'column',  // Sắp xếp các phần tử theo cột
    justifyContent: 'center', // Căn giữa theo chiều dọc
    alignItems: 'center', // Căn giữa theo chiều ngang
    padding:5,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowRadius: 2,
    elevation: 5,
    
  },
  ColumnPicture: {
    flexDirection: 'column',  // Sắp xếp các phần tử theo cột
    justifyContent: 'center', // Căn giữa theo chiều dọc
    alignItems: 'center', // Căn giữa theo chiều ngang
    padding: 5,
    
  },
  transactionRow: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
  },
  transactionContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
},
transactionContent: {
    marginBottom: 8,
},
transactionName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
},
detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
},
detailLabel: {
    fontWeight: 'bold',
    marginRight: 4,
},
detailText: {
    flex: 1,
},
timestamp: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
},

  


  
});