import "./style.css";
import "./commerce.css";
export const metadata = {
  title: "Bếp Núc · Pilot Hà Nội",
  description: "Chốt bữa cuối ngày, nhận tại quán.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
