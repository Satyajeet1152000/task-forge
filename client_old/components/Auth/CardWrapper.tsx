"use client";

import LinkButton from "../LinkButton";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Header from "./Header";

interface CardWrapperProps {
    children: React.ReactNode;
    footerText: string;
    footerHref: string;
    footerHrefText: string;
}
const CardWrapper = ({
    children,
    footerText,
    footerHref,
    footerHrefText,
}: CardWrapperProps) => {
    return (
        <Card className=" w-[600px] shadow-md p-10">
            <CardHeader>
                <Header />
            </CardHeader>
            <CardContent>{children}</CardContent>
            <CardFooter className="flex items-center justify-center">
                {footerText}
                <LinkButton href={footerHref} label={footerHrefText} />.
            </CardFooter>
        </Card>
    );
};

export default CardWrapper;
