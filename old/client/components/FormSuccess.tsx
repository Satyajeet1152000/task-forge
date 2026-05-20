import { cn } from "@/lib/utils";
import { CheckCheckIcon, CircleCheckBig, TriangleAlert } from "lucide-react";
import React from "react";

interface FormSuccessProps {
    success?: boolean;
    message?: string;
}
const FormSuccess = ({ success, message }: FormSuccessProps) => {
    if (!message) return null;
    return (
        <div
            className={cn(" p-3 rounded-md flex items-center gap-x-2 text-lg", {
                "bg-emerald-500/20 text-emerald-500": success,
                "bg-destructive/20 text-destructive": !success,
            })}
        >
            {success ? (
                <CircleCheckBig className=" h-4 w-4" />
            ) : (
                <TriangleAlert className=" h-4 w-4" />
            )}
            <p>{message}</p>
        </div>
    );
};

export default FormSuccess;
