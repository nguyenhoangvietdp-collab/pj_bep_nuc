export const metadata = { title: "Bếp Núc · Demo", description: "Thử chọn bữa cuối ngày bằng dữ liệu giả. Không nhận tiền thật." };
export default function Layout({ children }: { children: React.ReactNode }) {
  const base = process.env.PAGES_BASE_PATH || "";
  return <html lang="vi"><head><link rel="stylesheet" href={process.env.PAGES_STYLE_HREF || `${base}/theme.css`} /><link rel="preload" href={`${base}/fonts/inter/InterVariable.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" /></head><body>{children}</body></html>;
}
