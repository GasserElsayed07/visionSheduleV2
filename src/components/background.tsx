import React, { ReactNode } from "react";

type BackgroundProps = {
    children: ReactNode;
};

const Background = ({ children }: BackgroundProps) => (
    <div className="min-h-screen w-full bg-[#0f0f0f] relative text-white">
        {/* Concentric Squares - Dark Pattern */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(125% 125% at 50% 100%, #000000 40%, #350136 100%)",
          }}
        />
        <div className="relative z-10 w-full h-screen flex">{children}</div>
    </div>
);

export default Background;

