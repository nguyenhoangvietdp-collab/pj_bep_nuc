export default function LoadingScreen({ label = "Đang tải Bếp Núc…" }: { label?: string }) {
  return (
    <section className="commerce loading-screen" role="status" aria-live="polite">
      <div className="loading-symbol" aria-hidden="true"><span /><span /><span /></div>
      <h2>{label}</h2>
      <p>Thông tin sẽ xuất hiện ngay khi tải xong.</p>
      <div className="loading-skeleton" aria-hidden="true">
        <div /><div /><div />
      </div>
    </section>
  );
}
