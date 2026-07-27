import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full appearance-none
            bg-white border border-slate-200
            text-slate-900 text-sm font-medium
            rounded-lg px-4 py-2.5 pr-10
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            hover:border-slate-300
            transition-all duration-200
            cursor-pointer
            [&>option]:bg-white [&>option]:text-slate-900
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
          strokeWidth={2.5}
        />
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
