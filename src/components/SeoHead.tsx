import { resolveSeoForPath } from "../lib/seoResolver";

export default function SeoHead({ pathname }: { pathname: string }) {
  const seo = resolveSeoForPath(pathname);
  void seo;

  return null;
}
