import { StyleSheet } from "react-native";

const styles=StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      linearGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
      },
      containerInside:
      {
        alignItems: 'center',
        width:'80%',
        height:'30%',
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
      error:
      {
        color:'#f83c44',
        fontSize:20
      },
      EnterPin:
      {
        fontSize:18,
        fontWeight:'bold',
        color:'black'
      },
      button: {
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        padding: 10,
      },
      buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      text: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
      },
      user:
      {
       
        width:'100%',
        justifyContent:"center",
        alignItems:'center',
      },
      
      userText:
      {
        color:'black'
      },
      blurOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
})

export default styles;