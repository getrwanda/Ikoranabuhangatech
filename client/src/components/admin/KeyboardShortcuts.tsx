import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Command, Search, Download, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface ShortcutGroup {
    name: string;
    shortcuts: {
        key: React.ReactNode;
        description: string;
    }[];
}

export function KeyboardShortcuts() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Toggle shortcuts modal with '?' (Shift + /)
            if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
                if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
                    return;
                }
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }

            // Close modal with Esc
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    const shortcutGroups: ShortcutGroup[] = [
        {
            name: "General",
            shortcuts: [
                { key: <span className="font-mono text-xs border rounded px-1 py-0.5 bg-muted">?</span>, description: "Show keyboard shortcuts" },
                { key: <span className="font-mono text-xs border rounded px-1 py-0.5 bg-muted">Esc</span>, description: "Close modal / Clear selection" },
            ],
        },
        {
            name: "Navigation",
            shortcuts: [
                { key: <span className="flex items-center gap-1 font-mono text-xs border rounded px-1 py-0.5 bg-muted">g <span className="text-muted-foreground">then</span> d</span>, description: "Go to Dashboard" },
                { key: <span className="flex items-center gap-1 font-mono text-xs border rounded px-1 py-0.5 bg-muted">g <span className="text-muted-foreground">then</span> s</span>, description: "Go to Submissions" },
            ],
        },
        {
            name: "Data Actions",
            shortcuts: [
                { key: <span className="flex items-center gap-1 font-mono text-xs border rounded px-1 py-0.5 bg-muted">Ctrl K</span>, description: "Focus search bar" },
                { key: <span className="flex items-center gap-1 font-mono text-xs border rounded px-1 py-0.5 bg-muted">Ctrl E</span>, description: "Export data" },
            ],
        },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Command className="h-5 w-5" />
                        Keyboard Shortcuts
                    </DialogTitle>
                    <DialogDescription>
                        Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"><span className="text-xs">?</span></kbd> to toggle this menu
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    {shortcutGroups.map((group) => (
                        <div key={group.name} className="space-y-3">
                            <h4 className="text-sm font-medium text-muted-foreground">{group.name}</h4>
                            <div className="grid gap-2">
                                {group.shortcuts.map((shortcut, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-sm">{shortcut.description}</span>
                                        <div className="flex items-center gap-1">
                                            {shortcut.key}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
