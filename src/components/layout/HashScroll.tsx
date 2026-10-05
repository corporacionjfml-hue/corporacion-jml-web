"use client";

import { useEffect } from "react";

const ATTR = "data-render-all";
const RELEASE_MS = 2000;

/**
 * Sections marked `.defer-render` use `content-visibility: auto`, so the ones above an anchor
 * target still have their placeholder height when the browser computes the scroll position, and
 * the page lands off target once they render. Before an in-page jump, render them all (the
 * browser remembers the real sizes via `contain-intrinsic-size: auto`), then release.
 */
export function HashScroll() {
  useEffect(() => {
    const root = document.documentElement;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const renderAll = () => {
      root.setAttribute(ATTR, "");
      clearTimeout(timer);
      timer = setTimeout(() => root.removeAttribute(ATTR), RELEASE_MS);
    };

    const jumpToHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      renderAll();
      target.scrollIntoView({ behavior: "instant" });
    };

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href*='#']");
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin === window.location.origin && url.pathname === window.location.pathname && url.hash.length > 1) {
        renderAll();
      }
    };

    if (window.location.hash) renderAll();
    window.addEventListener("hashchange", jumpToHash);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("hashchange", jumpToHash);
      document.removeEventListener("click", onClick, true);
      clearTimeout(timer);
    };
  }, []);

  return null;
}
