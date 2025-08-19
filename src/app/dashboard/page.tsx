import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import AnimatedHeading from "~/components/animations/AnimatedHeading";
import ApplicationStats from "~/components/ApplicationStats";
import JobRecommendations from "~/components/JobRecommendations";

export const metadata: Metadata = {
  title: "Dashboard | VizzarJobs",
  description: "Your personalized job search dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }
  
  try {
    const stats = await api.applications.getUserStats();
    const recentApplications = await api.applications.getRecent({ limit: 3 });
    
    return (
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <AnimatedHeading level="h1" className="text-3xl md:text-4xl">
            Welcome back, {session.user.name?.split(' ')[0] || 'there'}!
          </AnimatedHeading>
        </div>
        
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Your Application Summary</h2>
          <ApplicationStats stats={stats} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <JobRecommendations userId={session.user.id} limit={6} />
          </div>
          
          <div className="space-y-6">
            <AnimatedHeading level="h2" className="text-xl" underline>
              Job Search Tips
            </AnimatedHeading>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-lg mb-3">Complete Your Profile</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Candidates with complete profiles are 40% more likely to hear back from employers.
              </p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full" 
                  style={{ width: `${session.user.profileCompleteness || 60}%` }}
                ></div>
              </div>
              <div className="text-right text-xs mt-1 text-muted-foreground">
                {session.user.profileCompleteness || 60}% Complete
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold text-lg mb-3">Resume Insights</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs mr-2 mt-0.5">!</div>
                  <span className="text-sm">Add more specific achievements with metrics to your experience</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs mr-2 mt-0.5">✓</div>
                  <span className="text-sm">Your technical skills section is strong</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs mr-2 mt-0.5">!</div>
                  <span className="text-sm">Consider adding a portfolio link to showcase your work</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold text-lg mb-3">Upcoming Events</h3>
              {[
                { 
                  title: "Tech Career Fair", 
                  date: "Aug 25, 2025",
                  time: "10:00 AM - 4:00 PM", 
                  virtual: true 
                },
                { 
                  title: "Resume Workshop", 
                  date: "Aug 30, 2025",
                  time: "1:00 PM - 3:00 PM", 
                  virtual: true 
                },
              ].map((event, i) => (
                <div key={i} className={`py-3 ${i > 0 ? 'border-t' : ''}`}>
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground">{event.date}, {event.time}</div>
                  <div className="text-xs mt-1 inline-block px-2 py-0.5 bg-blue-50 text-blue-800 rounded-full">
                    {event.virtual ? 'Virtual Event' : 'In-person'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading dashboard:", error);
    return (
      <div className="container py-8">
        <AnimatedHeading level="h1" className="text-3xl md:text-4xl mb-8">
          Welcome to your Dashboard
        </AnimatedHeading>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            There was an error loading your dashboard. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
