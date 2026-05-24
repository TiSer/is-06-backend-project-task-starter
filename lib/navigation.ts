/** Match nav item as active without false positives (e.g. /records vs /records-old). */
export function isActiveNavPath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
