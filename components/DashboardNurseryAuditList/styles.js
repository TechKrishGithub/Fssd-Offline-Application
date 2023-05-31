import { StyleSheet } from "react-native";

const styles=StyleSheet.create({
      successText: {
        fontSize: 13,
        color: 'green',
      },
      pendingText: {
        fontSize: 15,
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
        fontSize:14,
        color:'#142f52'
      },
      auditInfo:
      {
        flexDirection:'row',
        borderBottomWidth:0.5,
        borderBottomColor:'gray'
      },
      buttonContainerDetails: {
        backgroundColor: '#e74c3c',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
      },
     
      buttonTextDetails: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
      },
      ListContent:
      {
        padding:5,
        borderBottomColor:'#e2e0f7',
        borderBottomWidth:0.8,
      },
      auditName:
      {
        fontSize:17,
        fontWeight:'bold',
        borderBottomWidth:0.8,
        borderBottomColor:'#e2e0f7'
      },
      savEdit:
      {
        flexDirection:'row',
      },
      edit: 
      {
        marginLeft:45
      }
})

export default styles;