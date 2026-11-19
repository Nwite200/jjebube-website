import { cn } from "@/lib/utils";

export function Money({
  value,
  className,
  symbolClassName,
  onRequest = "Price on request",
}: {
  value: number | null | undefined;
  className?: string;
  symbolClassName?: string;
  onRequest?: string;
}) {
  if (value === null || value === undefined) {
    return <span className={cn("whitespace-nowrap", className)}>{onRequest}</span>;
  }
  return (
    <span className={cn("whitespace-nowrap tabular-nums", className)}>
      <span
        aria-hidden="true"
        className={cn("mr-[0.04em] inline-block font-sans font-bold", symbolClassName)}
        style={{ fontSize: "0.6em", verticalAlign: "0.04em" }}
      >
        ₦
      </span>
      {new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(value)}
    </span>
  );
}
