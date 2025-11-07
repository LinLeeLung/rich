/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // <— 關鍵
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [], // 需要表單樣式可加：require('@tailwindcss/forms')
};
