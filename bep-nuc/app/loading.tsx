import LoadingScreen from "./components/loading-screen";
import { SiteHeader, SiteFooter } from "./components/site-frame";
export default function Loading() {
  return <div className="site-frame commerce"><SiteHeader /><main id="content"><LoadingScreen /></main><SiteFooter /></div>;
}
