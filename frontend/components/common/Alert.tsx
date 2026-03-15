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
    info: "bg-blue-50 text-blue-800 border-blue-200",
    error: "bg-red-50 text-red-800 border-red-200",
    success: "bg-green-50 text-green-800 border-green-200",
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
