import { SidebarMenuButton } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { IconDotsVertical } from "@tabler/icons-react"

export default function UserNavSkeleton() {
    return (
        <SidebarMenuButton
            size="lg"
            className="rounded-lg"
        >
            <Skeleton className="h-8 w-8 rounded-lg" />

            <div className="grid flex-1 text-left text-sm leading-tight gap-1.5">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-2.5 w-14" />
            </div>

            <IconDotsVertical className="ml-auto size-4 text-muted-foreground/30" />
        </SidebarMenuButton>
    )
}
