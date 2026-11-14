const recuperarDestinoLogin = (state: unknown): string => {
  if (!state || typeof state !== "object" || !("from" in state)) return "/home";
  const from = state.from;
  if (!from || typeof from !== "object" || !("pathname" in from))
    return "/home";
  const pathname = from.pathname;
  if (
    typeof pathname !== "string" ||
    !pathname.startsWith("/") ||
    pathname.startsWith("//") ||
    pathname.includes("\\") ||
    Array.from(pathname).some((caractere) => caractere.charCodeAt(0) < 32) ||
    pathname === "/" ||
    /^\/login\/?$/i.test(pathname)
  )
    return "/home";

  const search =
    "search" in from &&
    typeof from.search === "string" &&
    from.search.startsWith("?")
      ? from.search
      : "";
  const hash =
    "hash" in from && typeof from.hash === "string" && from.hash.startsWith("#")
      ? from.hash
      : "";
  return pathname + search + hash;
};

export default recuperarDestinoLogin;
