import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    justifyContent: "flex-start",
    marginBottom: 50
  },
  questionRowView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flex: 0.1,
    marginHorizontal: 12,
  },
  userView: {
    height: 45,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginHorizontal: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  scoreInput: {
    height: 45,
    padding: 10,
    width: 60,
    borderWidth: 1,
    borderColor: "gray",
    marginHorizontal: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  textLabel: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "left",
    padding: 5,
    marginLeft: 15,
    marginVertical: 5,
    marginTop: 5,
  },
  badgeView: { position: "absolute", top: -15, right: 200 },
  Indicator:
  {
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  question:
  {
    padding:5,
    marginTop:5,
    marginBottom:10
  },
  Heading:
  {
    backgroundColor:'#677676',
    justifyContent:'center'
  },
  HeadText:
  {
    fontSize:17,
    fontWeight:'bold',
    marginLeft:10,
    color:'#fff'
  }
});

export default styles;
