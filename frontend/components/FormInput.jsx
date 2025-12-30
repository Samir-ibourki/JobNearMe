import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../theme/colors";
import { inputsStyles } from "../theme/inputsStyles";

const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  iconName,
  secureTextEntry,
  showPassword,
  setShowPassword,
  keyboardType = "default",
  autoCapitalize = "none",
}) => {
  return (
    <View style={inputsStyles.inputContainer}>
      {label && <Text style={inputsStyles.label}>{label}</Text>}
      <View
        style={[inputsStyles.inputWrapper, value && inputsStyles.inputFocused]}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={value ? Colors.Secondary : "#999"}
          />
        )}
        <TextInput
          style={inputsStyles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
        />
        {secureTextEntry !== undefined && setShowPassword && (
          <TouchableOpacity onPress={setShowPassword}>
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormInput;
