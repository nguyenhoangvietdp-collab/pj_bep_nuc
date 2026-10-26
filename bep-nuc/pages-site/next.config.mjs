import { fileURLToPath } from "node:url";
export default {
  output: "export",
  outputFileTracingRoot: fileURLToPath(new URL("../", import.meta.url)),
  trailingSlash: true,
  basePath: process.env.PAGES_BASE_PATH || "",
  env: { NEXT_PUBLIC_PAGES_BASE_PATH: process.env.PAGES_BASE_PATH || "" },
};
