import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Copy, Image as ImageIcon, FileText, Search } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MediaFile {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    createdAt: string;
}

export default function MediaLibrary() {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    const fetchFiles = async () => {
        try {
            const response = await fetch("/api/admin/media");
            const data = await response.json();
            if (data.success) {
                setFiles(data.data);
            }
        } catch (error) {
            console.error("Error fetching media files:", error);
            toast({
                title: "Error",
                description: "Failed to load media files",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                toast({
                    title: "Success",
                    description: "File uploaded successfully",
                });
                fetchFiles();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            toast({
                title: "Error",
                description: "Failed to upload file",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const response = await fetch(`/api/admin/media/${deleteId}`, {
                method: "DELETE",
            });

            const data = await response.json();
            if (data.success) {
                toast({
                    title: "Success",
                    description: "File deleted successfully",
                });
                fetchFiles();
            }
        } catch (error) {
            console.error("Error deleting file:", error);
            toast({
                title: "Error",
                description: "Failed to delete file",
                variant: "destructive",
            });
        } finally {
            setDeleteId(null);
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(window.location.origin + url);
        toast({
            title: "Copied",
            description: "URL copied to clipboard",
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const filteredFiles = files.filter((file) =>
        file.originalName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Media Library</CardTitle>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search files..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 w-64"
                                />
                            </div>
                            <Button disabled={uploading} onClick={() => document.getElementById("file-upload")?.click()}>
                                <Upload className="h-4 w-4 mr-2" />
                                {uploading ? "Uploading..." : "Upload File"}
                            </Button>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                className="hidden"
                                aria-label="Upload media file"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading...</div>
                    ) : filteredFiles.length === 0 ? (
                        <div className="text-center py-12">
                            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                {searchQuery ? "No files match your search" : "No files uploaded yet"}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Preview</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Uploaded</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFiles.map((file) => (
                                    <TableRow key={file.id}>
                                        <TableCell>
                                            {file.mimeType.startsWith("image/") ? (
                                                <img
                                                    src={file.url}
                                                    alt={file.originalName}
                                                    className="h-12 w-12 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                                                    <FileText className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{file.originalName}</TableCell>
                                        <TableCell className="text-muted-foreground">{file.mimeType}</TableCell>
                                        <TableCell className="text-muted-foreground">{formatFileSize(file.size)}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(file.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(file.url)}
                                                    title="Copy URL"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => window.open(file.url, "_blank")}
                                                    title="View"
                                                >
                                                    <ImageIcon className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setDeleteId(file.id)}
                                                    className="text-red-500 hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete File</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this file? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
