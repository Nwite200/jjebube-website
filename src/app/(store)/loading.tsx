export default function StoreLoading() {
  return (
    <div className="container-edge py-16">
      <div className="skeleton h-3 w-28" />
      <div className="skeleton mt-5 h-14 w-2/3 max-w-xl" />
      <div className="skeleton mt-4 h-3 w-1/3 max-w-sm" />
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[3/4]" />
        ))}
      </div>
    </div>
  );
}
