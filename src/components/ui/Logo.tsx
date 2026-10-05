/** Logo chữ T và D lồng nhau: nét dọc của T cũng là thân chữ D */
export function Logo({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="TD">
      <rect width="32" height="32" rx="8" fill="#4f46e5" />
      <path d="M6.5 9.5H17.5M12.5 9.5V22.5M12.5 9.5H16a6.5 6.5 0 0 1 0 13h-3.5"
        fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
