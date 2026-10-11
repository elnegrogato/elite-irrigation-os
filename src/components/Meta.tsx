import { resolveMetaForPath } from "../lib/metaDynamic";

export default function Meta({ pathname }: { pathname: string }) {
  const meta = resolveMetaForPath(pathname);
  void meta;

  return null;
}
