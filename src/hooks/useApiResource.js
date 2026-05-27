import { useEffect, useState } from "react";
import { fetchApi } from "../lib/api.js";

export function useApiResource(path, fallback, transform = (value) => value) {
  const [data, setData] = useState(() => transform(fallback));
  const [status, setStatus] = useState("fallback");
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    setStatus("loading");
    setError(null);

    fetchApi(path)
      .then((payload) => {
        if (!active) return;
        setData(transform(payload));
        setStatus("ready");
      })
      .catch((caughtError) => {
        if (!active) return;
        setError(caughtError);
        setStatus("fallback");
      });

    return () => {
      active = false;
    };
  }, [path]);

  return { data, status, error };
}
