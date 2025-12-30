import { Text } from "react-native";
import { inputsStyles } from "../theme/inputsStyles";

const Terms = () => {
  return (
    <Text style={inputsStyles.termsText}>
      By continuing, you agree to our{" "}
      <Text style={inputsStyles.linkText}>Terms of Service</Text> and{" "}
      <Text style={inputsStyles.linkText}>Privacy Policy</Text>
    </Text>
  );
};

export default Terms;
