const motifs = ["arc", "flower", "bowl", "leaf", "smile", "arc", "stripes", "flower", "leaf", "arc", "smile", "leaf"];

export default function BrandGarden({ className = "" }: { className?: string }) {
  return <div className={`brand-garden ${className}`} aria-hidden="true">
    {motifs.map((motif, index) => <span key={index} className={`garden-tile garden-${motif}`}><i /><i /><i /></span>)}
  </div>;
}
