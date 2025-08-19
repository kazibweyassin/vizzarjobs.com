import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import ApplicationList from "~/components/ApplicationList";
import ApplicationStats from "~/components/ApplicationStats";
import { Button } from "~/components/ui/button";
import AnimatedHeading from "~/components/animations/AnimatedHeading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export const metadata: Metadata = {
  title: "Application Dashboard | VizzarJobs",
  description: "Track and manage your job applications",
};

export default async function ApplicationDashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard/applications");
  }
  
  try {
    const { applications } = await api.applications.getMyApplications({});
    const stats = await api.applications.getApplicationStats();
    
    return (
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <AnimatedHeading level="h1" className="text-3xl md:text-4xl">
            Your Applications
          </AnimatedHeading>
          <Button asChild>
            <a href="/jobs">Browse More Jobs</a>
          </Button>
        </div>
        
        <ApplicationStats stats={stats} className="mb-8" />
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <ApplicationList 
              applications={applications} 
              emptyMessage="You haven't applied to any jobs yet." 
            />
          </TabsContent>
          
          <TabsContent value="active">
            <ApplicationList 
              applications={applications.filter(app => 
                app.status === 'APPLIED' || app.status === 'IN_REVIEW'
              )} 
              emptyMessage="You don't have any active applications." 
            />
          </TabsContent>
          
          <TabsContent value="interviews">
            <ApplicationList 
              applications={applications.filter(app => 
                app.status === 'INTERVIEW' || app.status === 'OFFER'
              )} 
              emptyMessage="You don't have any interview invitations yet." 
            />
          </TabsContent>
          
          <TabsContent value="rejected">
            <ApplicationList 
              applications={applications.filter(app => app.status === 'REJECTED')} 
              emptyMessage="You don't have any rejected applications." 
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    console.error("Error fetching applications:", error);
    return (
      <div className="container py-8">
        <AnimatedHeading level="h1" className="text-3xl md:text-4xl mb-8">
          Your Applications
        </AnimatedHeading>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            There was an error loading your applications. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
