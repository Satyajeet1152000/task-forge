import * as React from "react";

import { cn } from "@/lib/utils";

export type TextVariant = "default" | "muted" | "destructive" | "primary" | "secondary";

type TextElement = "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const variantClasses: Record<TextVariant, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  destructive: "text-destructive",
  primary: "text-primary",
  secondary: "text-secondary-foreground",
};

const sizeClasses: Record<TextElement, string> = {
  p: "text-sm leading-2",
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight",
  h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  h5: "text-lg font-semibold tracking-tight",
  h6: "text-base font-semibold tracking-tight",
};

type TextProps<T extends React.ElementType> = {
  as?: T;
  variant?: TextVariant;
  className?: string;
} & React.ComponentPropsWithoutRef<T>;

type TextComponent = <T extends React.ElementType = "p">(
  props: TextProps<T>,
) => React.ReactElement | null;

const BaseText: TextComponent = ({
  as,
  variant = "default",
  className,
  ...props
}: TextProps<React.ElementType>) => {
  const Component = as || "p";

  return (
    <Component
      className={cn(
        sizeClasses[Component as TextElement] || sizeClasses.p,
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
};

type TextCompound = TextComponent & {
  H1: TextComponent;
  H2: TextComponent;
  H3: TextComponent;
  H4: TextComponent;
  H5: TextComponent;
  H6: TextComponent;
};

export const Text = BaseText as TextCompound;

Text.H1 = (props) => <BaseText as="h1" {...props} />;
Text.H2 = (props) => <BaseText as="h2" {...props} />;
Text.H3 = (props) => <BaseText as="h3" {...props} />;
Text.H4 = (props) => <BaseText as="h4" {...props} />;
Text.H5 = (props) => <BaseText as="h5" {...props} />;
Text.H6 = (props) => <BaseText as="h6" {...props} />;
