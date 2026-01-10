export const getStatusConfig = (status) => {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        color: "#F5A623",
        bgColor: "#FFF8E7",
        icon: "time-outline",
      };
    case "accepted":
      return {
        label: "Accepted",
        color: "#1ABC9C",
        bgColor: "#E8F8F5",
        icon: "checkmark-circle-outline",
      };
    case "rejected":
      return {
        label: "Rejected",
        color: "#FF6B6B",
        bgColor: "#FFF5F5",
        icon: "close-circle-outline",
      };
    default:
      return {
        label: "Unknown",
        color: "#888",
        bgColor: "#F5F5F5",
        icon: "help-outline",
      };
  }
};
