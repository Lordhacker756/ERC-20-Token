import React from "react";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "warning"
    | "gradient-border";
  fullWidth?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText = "Loading...",
  children,
  variant = "primary",
  fullWidth = false,
  disabled,
  className = "",
  ...props
}) => {
  const baseClasses =
    "font-semibold py-2 px-4 rounded transition duration-200 flex items-center justify-center cursor-pointer";

  const variantClasses = {
    primary: "bg-purple-700 hover:bg-purple-600 text-white",
    secondary: "bg-gray-800 hover:bg-gray-700 text-white",
    danger: "bg-red-700 hover:bg-red-600 text-white",
    success: "bg-green-700 hover:bg-green-600 text-white",
    warning: "bg-orange-700 hover:bg-orange-600 text-white",
    "gradient-border":
      "bg-black text-white border border-transparent hover:bg-black/80 bg-gradient-padding",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass =
    disabled || isLoading ? "opacity-70 cursor-not-allowed" : "";

  // Special style for gradient border buttons
  const gradientBorderClass =
    variant === "gradient-border" ? "gradient-border-btn" : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${gradientBorderClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
