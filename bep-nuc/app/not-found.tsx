import Link from "next/link";
import { SiteHeader, SiteFooter } from "./components/site-frame";
export default function NotFound() {
  return <div className="site-frame commerce"><SiteHeader /><main id="content"><div className="market-content"><h1>Không tìm thấy trang</h1><p>Đường dẫn này không còn khả dụng. Bạn có thể quay lại danh sách bữa đang có.</p><Link className="button-link" href="/meals">Chọn bữa hôm nay</Link></div></main><SiteFooter /></div>;
}
