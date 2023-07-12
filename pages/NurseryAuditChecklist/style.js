import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  userView: {
    flex: 0.046,
    justifyContent: "space-between",
    flexDirection: "row",
    marginHorizontal: 16,
    alignContent: "center",
    alignItems: "center",
    padding: 13,
    borderRadius: 5,
    // backgroundColor: "lightgrey",
    borderWidth: 1,
    borderColor: "gray",
    marginTop: 10,
  },
  InnerDate:
  {
    flexDirection:'row',
  },
  userlabel: {
    textAlign: "left",
    fontSize: 12,
    fontWeight: "700",
    color: "gray",
  },
  
container: {
    padding: 16,
    backgroundColor: "white",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    
  },
  textInput: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 20,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 12,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
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
  text: {
    marginRight: 5,
  },
  dots: {
    fontSize: 20,
  },
  multiSelect:
  {
    selectToggle: {
      // Increase specificity and add !important to override other styles
      borderColor: 'gray',
      height:50,
      borderWidth: 0.5,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginBottom: 10,
    },
    
  },
  selectText: {
    color: 'blue',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedItemText: {
    color: 'red',
  },
  selectItem: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  selectedItem: {
    backgroundColor: 'blue', // Set the background color of selected items
  },
  dropdownContainer: {
    backgroundColor: 'lightgray', // Set the background color of the dropdown container
    borderRadius: 5,
    marginTop: 10,
    elevation: 2, // Add elevation for shadow effect (Android)
    shadowColor: '#000', // Add shadow color (iOS)
    shadowOpacity: 0.3, // Add shadow opacity (iOS)
    shadowRadius: 5, // Add shadow radius (iOS)
    shadowOffset: { width: 0, height: 2 }, // Add shadow offset (iOS)
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginHorizontal: 5,
    paddingHorizontal: 10,
    borderRadius:8
  },
  nameOfRep:
  {
    flexDirection:'row',
    justifyContent: 'space-between',
    padding:10,
    borderColor: "gray",
    borderWidth: 0.6,
    borderRadius: 8,
    height:60
  },
  NurObsText:
  {
    color:'black',
    fontSize:18,
    fontWeight:'600',
    marginLeft:8,
    marginRight:15
  },
  downIcon:
  {
    position:'absolute',
    right:0
  },
  button: {
    backgroundColor: '#53b792',
    borderRadius: 8,
    width:'20%',
    padding: 5,
    alignItems: 'center',
    justifyContent:'center',
    flexDirection:'row'
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default styles;
