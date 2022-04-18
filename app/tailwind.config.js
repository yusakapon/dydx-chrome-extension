module.exports = {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        modal: "#1c1c28",
        "modal-container": "#333347",
        "modal-selected": "#454258",
        sell: "#ff5353",
        buy: "#3fb68b",
      },
    },
  },
  plugins: [],
};
