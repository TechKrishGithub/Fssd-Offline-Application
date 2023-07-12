import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  
    container: {
        padding:16,
        backgroundColor: "white",
       
      },
      label: {
        position: "absolute",
        backgroundColor: "white",
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
      },
      dropdown: {
        height: 50,
        borderColor: "gray",
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        
      },
      ObservHead:
      {
        fontSize:15,
        fontWeight:'600',
        color:'white',
        paddingLeft:10,
      },
      HeadContainer:
      {
        backgroundColor:'#1d9831',
        borderWidth:0.5,
        borderColor:'grey',
        justifyContent:'center',
        height:50
      },

      ObservDropdown:{
        borderColor: "gray",
        borderWidth: 0.5,
        paddingHorizontal: 10,
        flexDirection:'row'
      },
      ObservInfo:
      {
        height: 40,
        width:'80%',
        borderColor: "gray",
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        fontSize:15,
        fontWeight:'500'
      },
      ObservDropdownTable:
      {
        marginTop:10,
        borderColor: "gray",
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
      },
      TableTitles:
      {
        fontSize:12,
        fontWeight:'bold',
        color:'black'
      },
      errorField:
      {
        width:'100%',
        justifyContent:'center',
        alignItems:'center'
      },
      errorText:
      {
        color:'red'
      },
      successText:
      {
        color:'green',
        paddingLeft:30
      },
     
      fileSubmit:
      {
         marginRight:10
      },
      submitText:
      {
        fontSize:20,
        fontWeight:'bold'
      },
      Submitbutton: {
        backgroundColor: '#007aff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 20,
        flexDirection:'row',
        justifyContent:'center',
      },
      SubmitbuttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
      
      Indicator:
      {
      flex:1,
      justifyContent:'center',
      alignItems:'center'
      },
      picker: {
        backgroundColor: '#F5FCFF',
      },
      pickerItem: {
        color: 'red',
      },
      widthOfTableContent:
      {
        width:'15%'
      },
      content:
      {
        alignItems:'center',
        justifyContent:'center'
      },
     

})

export default styles;