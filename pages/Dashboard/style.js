import { StyleSheet } from "react-native";

const styles=StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F5F5F5'
        // backgroundColor:'rgba(198, 227, 228,0.5)'
      },
      header: {
        height: 50,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333333',
      },
      content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
      },
      infoBlock: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginBottom: 20,
        borderRadius: 10,
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      },
      infoBlockHeading: {
        fontSize: 21,
        fontWeight: 'bold',
        color: '#252aba',
        marginBottom: 10,
        borderBottomColor:'#dedeef',
        padding:10,
        borderBottomWidth:0.5
      },
      infoBlockContent: {
        fontSize: 21,
        fontWeight: 'bold',
        color: '#007AFF',
      },
      successText: {
        fontSize: 12,
        color: 'green',
      },
      pendingText: {
        fontSize: 13,
        color: 'orange',
        textDecorationLine:'underline',
        textDecorationColor:'blue'
      },
      auditcriterion:
      {
        width:'40%',
        fontWeight:'bold',
        marginBottom:10,
        marginRight:20,
        fontSize:16,
        color:'#142f52'
      },
      text: {
        color: 'blue',
        fontSize: 15,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
      },
      auditInfo:
      {
        flexDirection:'row',
        borderWidth:1,
        borderColor:'#e8f3f2'
      },
      Indicator:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
      },
      containerForLoad: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      textForLoad: {
        fontSize: 17,
        marginRight: 5,
      },
      dots: {
        fontSize: 27,
      },
      nurHead:
      {
        padding:10,
        fontSize:14,
        fontWeight:'500'
      },
      nurDetails:
      {
        padding:10,
        fontSize:9
      }
})

export default styles;