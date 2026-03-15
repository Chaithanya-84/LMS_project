export function Alert({
  variant = "info",
  children,
  className = "",
}: {
  variant?: "info" | "error" | "success";
  children: React.ReactNode;
  className?: string;
}) {
  const styles = {
    info: "bg-blue-900/30 text-blue-300 border-blue-700",
    error: "bg-red-900/30 text-red-400 border-red-800",
    success: "bg-emerald-900/30 text-emerald-400 border-emerald-700",
  };

  return (
    <div
      className={`rounded-lg border p-4 ${styles[variant]} ${className}`}
      role="alert"
    >
      {children}
    </div>
  );
}
