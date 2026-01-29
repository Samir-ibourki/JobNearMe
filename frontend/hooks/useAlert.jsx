import React, { createContext, useContext, useState, useCallback } from "react";
import CustomAlert from "../components/CustomAlert";

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success",
    confirmText: "Confirm",
    cancelText: "Cancel",
    onConfirm: null,
    autoClose: false,
  });

  // Success Alert
  const showSuccess = useCallback((title, message, options = {}) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type: "success",
      autoClose: options.autoClose ?? false,
      onConfirm: options.onConfirm || null,
      confirmText: options.confirmText || "Confirm",
      cancelText: options.cancelText || "Cancel",
    });
  }, []);

  // Error Alert
  const showError = useCallback((title, message, options = {}) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type: "error",
      autoClose: options.autoClose ?? false,
      onConfirm: options.onConfirm || null,
      confirmText: options.confirmText || "Confirm",
      cancelText: options.cancelText || "Cancel",
    });
  }, []);

  // Warning Alert
  const showWarning = useCallback((title, message, options = {}) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type: "warning",
      autoClose: options.autoClose ?? false,
      onConfirm: options.onConfirm || null,
      confirmText: options.confirmText || "Confirm",
      cancelText: options.cancelText || "Cancel",
    });
  }, []);

  // Info Alert
  const showInfo = useCallback((title, message, options = {}) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type: "info",
      autoClose: options.autoClose ?? false,
      onConfirm: options.onConfirm || null,
      confirmText: options.confirmText || "Confirm",
      cancelText: options.cancelText || "Cancel",
    });
  }, []);

  // Confirm Alert
  const showConfirm = useCallback((title, message, options = {}) => {
    return new Promise((resolve) => {
      setAlertConfig({
        visible: true,
        title,
        message,
        type: "confirm",
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
        autoClose: false,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  }, []);

  // Hide alert
  const hideAlert = useCallback(() => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleClose = useCallback(() => {
    if (alertConfig.onCancel) {
      alertConfig.onCancel();
    }
    hideAlert();
  }, [alertConfig, hideAlert]);

  const handleConfirm = useCallback(() => {
    if (alertConfig.onConfirm) {
      alertConfig.onConfirm();
    }
    hideAlert();
  }, [alertConfig, hideAlert]);

  const contextValue = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    hideAlert,
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={handleClose}
        onConfirm={handleConfirm}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        autoClose={alertConfig.autoClose}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export default useAlert;
