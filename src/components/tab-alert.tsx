"use client";

import { useEffect } from "react";

// Seconds on screen before the alert is armed, so only engaged visitors get it
const ARM_AFTER_SECONDS = 20;
const BLINK_MS = 2000;
// Same preview switch as the interview card (hire-toast.tsx): arms after 2 seconds
const PREVIEW_PARAM = "hire-preview";
// Fired when the visitor comes back after the alert ran; hire-toast.tsx opens its card on it
export const RETURN_EVENT = "portfolio:return";

// Draws the site icon with a gold "unread" dot in the corner, as a data URL
function dottedIcon(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const size = 64;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const g = canvas.getContext("2d");
      if (!g) return resolve(null);
      g.drawImage(img, 0, 0, size, size);
      g.fillStyle = "#0e1520";
      g.beginPath();
      g.arc(50, 14, 14, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#d9ae72";
      g.beginPath();
      g.arc(50, 14, 10, 0, Math.PI * 2);
      g.fill();
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// While the visitor is on another tab or app, the tab title blinks "(1) Available for interview"
// and the icon gets a dot, like an unread message. No permission prompt, unlike browser notifications.
export default function TabAlert({ text }: { text: string }) {
  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).has(PREVIEW_PARAM);
    const armAfter = preview ? 2 : ARM_AFTER_SECONDS;

    let seen = 0;
    let armed = false;
    let blink: number | undefined;
    let originalTitle = document.title;
    let dotted: string | null = null;
    const icons = () => Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]'));
    let originalIcons: string[] = [];

    const counter = window.setInterval(() => {
      if (document.visibilityState !== "visible" || !document.hasFocus()) return;
      seen += 1;
      if (seen >= armAfter) {
        armed = true;
        window.clearInterval(counter);
        const first = icons()[0];
        if (first) dottedIcon(first.href).then((url) => (dotted = url));
      }
    }, 1000);

    const away = () => {
      if (!armed || blink !== undefined) return;
      originalTitle = document.title;
      let on = true;
      document.title = text;
      blink = window.setInterval(() => {
        on = !on;
        document.title = on ? text : originalTitle;
      }, BLINK_MS);
      if (dotted) {
        originalIcons = icons().map((l) => l.href);
        icons().forEach((l) => (l.href = dotted as string));
      }
    };

    const back = () => {
      if (blink === undefined) return;
      window.clearInterval(blink);
      blink = undefined;
      document.title = originalTitle;
      icons().forEach((l, i) => originalIcons[i] && (l.href = originalIcons[i]));
      window.dispatchEvent(new Event(RETURN_EVENT));
    };

    // Away = another tab (visibilitychange) or another app while the browser stays visible (blur)
    const onVisibility = () => (document.hidden ? away() : back());
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", away);
    window.addEventListener("focus", back);
    return () => {
      window.clearInterval(counter);
      back();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", away);
      window.removeEventListener("focus", back);
    };
  }, [text]);

  return null;
}
