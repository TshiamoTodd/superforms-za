import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
interface StatsCardProps {
    title: string;
    icon: React.ReactNode;
    helperText: string;
    value: string;
    loading: boolean;
    className: string;  
}

export const StatsCard = ({
    title,
    icon,
    helperText,
    value,
    loading,
    className,
}:StatsCardProps) => {
    return (
        <Card className={className}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            {icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                loading && (
                  <Skeleton>
                    <span className="opacity-0">0</span>
                  </Skeleton>
              )}
              {!loading && value}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              {helperText}
            </p>
          </CardContent>
        </Card>
    );
}