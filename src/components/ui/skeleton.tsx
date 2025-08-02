"use client"

import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Specific skeleton components for common use cases
function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 space-y-4", className)}>
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}

function UtilityFunctionSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("border rounded-lg p-4 space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center space-x-2 pt-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-12" />
      </div>
    </div>
  )
}

function CodeEditorSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("border rounded-md", className)}>
      <div className="flex items-center justify-between p-3 border-b bg-muted/20">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
  )
}

function TableSkeleton({ rows = 5, cols = 4, className }: { 
  rows?: number
  cols?: number
  className?: string 
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {/* Header */}
      <div className="flex items-center space-x-4 border-b pb-2">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center space-x-4 py-2">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

function SearchResultsSkeleton({ count = 6, className }: { 
  count?: number
  className?: string 
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <UtilityFunctionSkeleton key={i} />
      ))}
    </div>
  )
}

export { 
  Skeleton, 
  CardSkeleton,
  UtilityFunctionSkeleton,
  CodeEditorSkeleton,
  TableSkeleton,
  SearchResultsSkeleton
}
