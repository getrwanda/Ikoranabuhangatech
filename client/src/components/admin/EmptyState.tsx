import { FileQuestion, Inbox } from "lucide-react";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="mb-4 text-muted-foreground">
                {icon || <Inbox className="h-16 w-16" />}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">{description}</p>
            {action && <div>{action}</div>}
        </div>
    );
}

export function NoResultsState() {
    return (
        <EmptyState
            icon={<FileQuestion className="h-16 w-16" />}
            title="No results found"
            description="Try adjusting your search or filter criteria to find what you're looking for."
        />
    );
}

export function NoDataState({ type }: { type: string }) {
    return (
        <EmptyState
            icon={<Inbox className="h-16 w-16" />}
            title={`No ${type} yet`}
            description={`When ${type} are submitted, they will appear here.`}
        />
    );
}
