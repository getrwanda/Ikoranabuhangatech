import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export function ApplicationDistributionChart() {
    const { data: distributionData, isLoading } = useQuery<{ success: boolean; data: { name: string; value: number; fill: string }[] }>({
        queryKey: ["/api/admin/analytics/distribution"],
    });

    if (isLoading) {
        return (
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Application Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                        Loading chart data...
                    </div>
                </CardContent>
            </Card>
        );
    }

    const data = distributionData?.data || [];

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Application Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)' }}
                            itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
