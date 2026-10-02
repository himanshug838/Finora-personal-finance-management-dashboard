import React from "react";

const GlassCard = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-slate-200/80
        bg-white/70
        p-6
        shadow-xl
        shadow-black/[0.03]
        backdrop-blur-xl
        transition-all
        duration-300
        dark:border-white/10
        dark:bg-[#0c1226]/60
        dark:shadow-black/20
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
