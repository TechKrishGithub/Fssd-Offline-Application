import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    containerForTotal:
    {
        marginTop:'20%',
        justifyContent:'center',
        alignItems:'center',
    
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    
    },
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
    },
    modalText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalButton: {
      padding: 10,
      borderRadius: 5,
      width: 100,
      alignItems: 'center',
    },
    modalCancelButton: {
      backgroundColor: '#999',
    },
    modalLogoutButton: {
      backgroundColor: 'red',
    },
    modalButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    text: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 5,
      },
      dots: {
        color:'#fff',
        fontSize:30,
        marginTop:-10
      },
      profile:
      {
        borderWidth:0.5,
        borderColor:'gray',
        borderRadius:100,
        height:'26%',
        width:'25%',
        backgroundColor:'#dedede',
        justifyContent:'center',
        alignItems:'center'
      },
      user:
      {
        fontSize:20,
        fontWeight:'bold',
        color:'#333'
      },
      Table:
      {
        flex:1,
        width:'90%',
        justifyContent:'center',
        alignItems:'center'
      },
      cell:
      {
        alignItems:'center',
        borderBottomColor:'gray',
        borderBottomWidth:0.5
      },
      textTable:
      {
        fontSize:15,
        fontWeight:'500',
      },
      containerForLogout: {
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#e74c3c',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width:'20%',
        height:'38%'
      },
      textForLogout: {
        color: '#fff',
        fontSize: 13,
        marginLeft: 10,
        fontWeight: 'bold'
      },

      button: {

        backgroundColor: '#4CAF50',
        borderRadius: 5,
        padding: 10,
        width:100,
        height:40,
        flexDirection: 'row',
        alignItems: 'center',
      },
      buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 10,
      },
      Buttons:
      {
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
      }
  });
  

export default style;