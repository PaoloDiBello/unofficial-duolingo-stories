import "@fontsource/nunito";
import "styles/global.css";
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1cb0f6" />
        <title>Duostories</title>
        <Script id="darklight">{`function get_current_theme() {
  // it's currently saved in the document?
  if (document.body.dataset.theme) {
    return document.body.dataset.theme;
  }
  // it has been previously saved in the window?
  if (
    window.localStorage.getItem("theme") !== undefined &&
    window.localStorage.getItem("theme") !== "undefined"
  ) {
    return window.localStorage.getItem("theme");
  }
  // or the user has a preference?
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
}

console.log("activeTheme...");
function load() {
  let activeTheme = get_current_theme();
      console.log("activeTheme", activeTheme);
  document.body.dataset.theme = activeTheme;
  window.localStorage.setItem("theme", activeTheme);
}
load()

document.addEventListener("DOMContentLoaded", load);
`}</Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
