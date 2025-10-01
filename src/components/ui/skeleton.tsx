import { Card, CardContent, CardHeader } from "~/components/ui/card";

// Basic skeleton component
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200 ${className || ""}`}
      {...props}
    />
  );
}

export function CompanyCardSkeleton() {
  return (
    <Card className="border border-white/20 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-200 rounded-xl animate-pulse"></div>
          <div className="flex-1 min-w-0">
            <div className="h-6 bg-slate-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-4/5"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-3/5"></div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded animate-pulse w-24"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded animate-pulse w-32"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded animate-pulse w-28"></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-slate-100">
          <div className="h-8 bg-slate-200 rounded-lg animate-pulse w-20"></div>
          <div className="h-8 bg-slate-200 rounded-lg animate-pulse w-24"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export function JobCardSkeleton() {
  return (
    <Card className="border border-white/20 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-6 bg-slate-200 rounded animate-pulse mb-2 w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2 mb-3"></div>
            <div className="flex items-center gap-2">
              <div className="h-6 bg-slate-200 rounded-full animate-pulse w-16"></div>
              <div className="h-6 bg-slate-200 rounded-full animate-pulse w-20"></div>
            </div>
          </div>
          <div className="w-12 h-12 bg-slate-200 rounded-lg animate-pulse"></div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-4/5"></div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded animate-pulse w-20"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded animate-pulse w-16"></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="h-4 bg-slate-200 rounded animate-pulse w-24"></div>
          <div className="h-8 bg-slate-200 rounded-lg animate-pulse w-20"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse"></div>
        <div className="h-6 bg-slate-200 rounded animate-pulse w-32"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-4 bg-slate-200 rounded animate-pulse w-4/5"></div>
        <div className="h-3 bg-slate-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-slate-200 rounded animate-pulse w-24"></div>
        <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse"></div>
      </div>
      <div className="h-8 bg-slate-200 rounded animate-pulse w-16 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded animate-pulse w-20"></div>
    </div>
  );
}