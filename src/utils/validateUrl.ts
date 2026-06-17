const ALLOWED_PROTOCOLS = ["http://", "https://"];

export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== "string") return false;

  const lower = url.trim().toLowerCase();

  const hasAllowedProtocol = ALLOWED_PROTOCOLS.some((protocol) =>
    lower.startsWith(protocol)
  );

  if (!hasAllowedProtocol) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
