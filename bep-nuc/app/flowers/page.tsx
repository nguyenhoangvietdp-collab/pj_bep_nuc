import FlowerShowcase from "../components/flower-showcase";
import {SiteHeader,SiteFooter} from "../components/site-frame";
export default function Flowers(){return <div className="site-frame commerce"><SiteHeader/><main id="content" tabIndex={-1}><div className="market-content"><FlowerShowcase/></div></main><SiteFooter/></div>;}
