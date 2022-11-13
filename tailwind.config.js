/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      container: {
        center: true,
      },
      fontFamily: {
        "noto-sans-tc": ["Noto Sans TC", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#0B7D77",
          hover: "#096561",
          selected: "#CEE5E4",
        },
        negative: "#D83A52",
        positive: "#0B8652",
        general: "#0073EA",
        dark: "#323338",
        "dark-grey": "#676879",
        grey: "#C5C7D0",
        "ui-grey": "#E6E9EF",
        "light-grey": "#F5F6F8",
      },
    },
  },
};
