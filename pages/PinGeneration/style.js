import { StyleSheet } from "react-native";


const styles=StyleSheet.create({
     container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      containerInside:
      {
        justifyContent: 'center',
        alignItems: 'center',
        width:'80%',
        height:'50%'
        // backgroundColor:'rgba(21, 61, 82,0.8)'
      },
      backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
      },
      circle: {
        width: 4 * 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 20,
      },
      confirmCircle: {
        width: 4 * 60,
        height: 60,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: 10,
      },
      circle: {
        width: 4 * 60,
        height: 60,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: 10,
      },
      dot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#8c8c8c',
        justifyContent: 'center',
        alignItems: 'center',
      },
      dotFilled: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: 'rgba(21, 61, 82,0.8)',
      },
      input: {
        position: 'absolute',
        opacity: 0,
        width: '100%',
        height: '100%',
        textAlign: 'center',
        fontSize: 30,
      },
      button: {
        backgroundColor: '#073270',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
      error:
      {
        fontSize:20,
        color:'#ee7474',
        fontWeight:'bold'
      },
      success:
      {
        fontSize:20,
        color:'#055533',
        fontWeight:'bold'
      },
      PinText:
      {
        color: 'black',
        fontSize: 20,
        marginLeft:-50,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      user:
      {
        width:'100%',
        justifyContent:"center",
        alignItems:'center',
        marginBottom:100
      },
      userText:
      {
        color:'black'
      }
     
})

export default styles;