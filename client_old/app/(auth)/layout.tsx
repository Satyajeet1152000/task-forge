import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className=" flex h-full flex-col items-center justify-center bg-gradient-to-b from-[#c3c3ec] to-[#3a24c7]">
            {children}
        </main>
    );
};

export default AuthLayout;
