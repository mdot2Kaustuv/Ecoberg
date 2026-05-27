import { useEffect, useState } from "react";
import { routeMeta } from "../data/platformContent.js";

function formatRoute(hash) {
  const clean = hash.replace(/^#\/?/, "");
  if (!clean) return "home";
  return routeMeta[clean] ? clean : "home";
}

export function useRoute() {
  const [route, setRoute] = useState(() => formatRoute(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(formatRoute(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (nextRoute) => {
    window.location.hash = nextRoute === "home" ? "/" : `/${nextRoute}`;
    setRoute(nextRoute);
  };

  return [route, navigate];
}
