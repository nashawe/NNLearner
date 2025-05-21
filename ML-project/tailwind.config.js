// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        "notification-pulse":
          "notification-pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        // ... other animations
      },
      keyframes: {
        "notification-pulse": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 0 0 rgba(250, 204, 21, 0.7)",
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 0 10px rgba(250, 204, 21, 0)",
          },
        },
        // ... other keyframes
      },
    },
  },
  plugins: [],
};
