import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  sendAudioContainer: {
    marginVertical: 10,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
    backgroundColor: "white",
  },

  audiProgressBG: {
    height: 3,
    flex: 1,
    backgroundColor: "lightgray",
    borderRadius: 5,
    margin: 10,
  },
  audioProgressFG: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#3777f0",

    position: "absolute",
    top: -3,
  },
});

export default styles;