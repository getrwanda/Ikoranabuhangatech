import { storage } from "./storage";
import { Request } from "express";

export async function logActivity(
    req: Request,
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: any
) {
    if (!req.user) return;

    try {
        await storage.createActivityLog({
            userId: (req.user as any).id,
            action,
            resourceType: resourceType || null,
            resourceId: resourceId || null,
            details: details || null,
            ipAddress: req.ip || null,
            userAgent: req.get("user-agent") || null,
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
}

export function toCSV(data: any[]): string {
    if (!data || data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(","),
        ...data.map(row => headers.map(fieldName => {
            const val = row[fieldName] ?? "";
            return JSON.stringify(val);
        }).join(","))
    ];
    return csvRows.join("\n");
}
