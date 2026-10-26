import { fileURLToPath } from "node:url";
export default { output:"export", trailingSlash:true, outputFileTracingRoot:fileURLToPath(new URL("../",import.meta.url)) };
