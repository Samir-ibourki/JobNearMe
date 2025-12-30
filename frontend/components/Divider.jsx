import { View, Text } from "react-native";
import { inputsStyles } from "../theme/inputsStyles";

const Divider = ({ text = "or" }) => {
  return (
    <View style={inputsStyles.divider}>
      <View style={inputsStyles.dividerLine} />
      <Text style={inputsStyles.dividerText}>{text}</Text>
      <View style={inputsStyles.dividerLine} />
    </View>
  );
};

export default Divider;
