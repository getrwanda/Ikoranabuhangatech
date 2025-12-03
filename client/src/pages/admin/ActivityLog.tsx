import { useQuery } from "@tanstack/react-query";
import { ActivityLog } from "@shared/schema";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, History } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { TableSkeleton } from "@/components/admin/TableSkeleton";
import { NoDataState } from "@/components/admin/EmptyState";

export default function ActivityLogPage() {
    const { data: logs, isLoading } = useQuery<{ success: boolean; data: ActivityLog[] }>({
        queryKey: ["/api/admin/activity-logs"],
    });

    const getActionColor = (action: string) => {
        if (action.includes("create")) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        if (action.includes("update")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
        if (action.includes("delete")) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="h-5 w-5" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <TableSkeleton rows={10} />
                        ) : !logs?.data || logs.data.length === 0 ? (
                            <NoDataState type="activity logs" />
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User ID</TableHead>
                                        <TableHead>Action</TableHead>
                                        <TableHead>Resource Type</TableHead>
                                        <TableHead>Details</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.data.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-medium">
                                                {log.userId || "System"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={getActionColor(log.action)}>
                                                    {log.action}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="capitalize">{log.resourceType}</TableCell>
                                            <TableCell className="max-w-md truncate" title={JSON.stringify(log.details)}>
                                                {log.details ? JSON.stringify(log.details) : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(log.createdAt), "MMM d, yyyy HH:mm")}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
