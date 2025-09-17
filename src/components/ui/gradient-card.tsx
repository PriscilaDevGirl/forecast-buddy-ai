import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GradientCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  gradient?: boolean;
}

export function GradientCard({ title, description, children, className, gradient = false }: GradientCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-500 hover:shadow-glow border-border/50",
      gradient && "bg-gradient-primary",
      className
    )}>
      <CardHeader>
        <CardTitle className={cn(
          "text-xl font-semibold",
          gradient && "text-white"
        )}>
          {title}
        </CardTitle>
        {description && (
          <CardDescription className={cn(
            gradient && "text-white/80"
          )}>
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}