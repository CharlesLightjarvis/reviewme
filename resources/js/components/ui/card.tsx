import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { Text } from "@/components/retroui/text";

interface ICardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Card = ({ className, ...props }: ICardProps) => (
  <div
    className={cn("inline-block border-2 rounded shadow-md transition-all hover:shadow-none bg-card", className)}
    {...props}
  />
);

const CardHeader = ({ className, ...props }: ICardProps) => (
  <div className={cn("flex flex-col justify-start p-4", className)} {...props} />
);

const CardTitle = ({ className, ...props }: ICardProps) => (
  <Text as="h3" className={cn("mb-2", className)} {...props} />
);

const CardDescription = ({ className, ...props }: ICardProps) => (
  <p className={cn("text-muted-foreground", className)} {...props} />
);

const CardContent = ({ className, ...props }: ICardProps) => (
  <div className={cn("p-4", className)} {...props} />
);

const CardFooter = ({ className, ...props }: ICardProps) => (
  <div className={cn("flex items-center p-4 pt-0", className)} {...props} />
);

const CardComponent = Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

export { CardComponent as Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
