export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export const themeColors: Record<Theme, string> = {
  light: "#eef2f6",
  dark: "#0e1520",
};

// Runs in <head> before first paint so the page never flashes the wrong theme
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=t==="dark"?"${themeColors.dark}":"${themeColors.light}"}catch(e){}})();`;
