import * as Icons from "../icons.jsx";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const REQUEST_TIMEOUT_MS = 2500;

export async function fetchApi(path) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function resolveIcon(iconName, fallback = Icons.Activity) {
  if (typeof iconName === "function") return iconName;
  return Icons[iconName] || fallback;
}

export function hydrateMetrics(metrics = []) {
  return metrics.map((metric) => ({
    ...metric,
    icon: resolveIcon(metric.icon),
  }));
}

export function hydrateDataSources(sources = []) {
  return sources.map((source) => ({
    ...source,
    icon: resolveIcon(source.icon, Icons.Database),
  }));
}

export function hydrateDashboard(payload) {
  return {
    ...payload,
    metrics: hydrateMetrics(payload.metrics),
    dataSources: hydrateDataSources(payload.dataSources),
  };
}

export function hydratePerCapita(payload) {
  return {
    ...payload,
    metrics: hydrateMetrics(payload.metrics),
  };
}

export function hydrateSources(payload) {
  return {
    ...payload,
    dataSources: hydrateDataSources(payload.dataSources),
  };
}

export function hydrateAdmin(payload) {
  return {
    ...payload,
    metrics: hydrateMetrics(payload.metrics),
  };
}
