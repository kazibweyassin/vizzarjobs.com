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
    const stats = await api.applications.getApplicationStats();
    const { applications: recentApplications } = await api.applications.getMyApplications({ limit: 3 });
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
        <div className="container py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <AnimatedHeading level="h1" className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Welcome back, {session.user.name?.split(' ')[0] || 'there'}! 👋
                </AnimatedHeading>
                <p className="text-lg text-slate-600 mt-2">Here's what's happening with your job search</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/20 shadow-sm">
                  <span className="text-sm font-medium text-slate-600">Last active: Today</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Application Summary */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">📊</span>
              </div>
              Your Application Summary
            </h2>
            <ApplicationStats stats={stats} />
          </div>
        
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
                <JobRecommendations userId={session.user.id} limit={6} />
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Profile Completion Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-100 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-blue-600 text-lg">✨</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">Complete Your Profile</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Candidates with complete profiles are <span className="font-semibold text-blue-600">40% more likely</span> to hear back from employers.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Profile Completion</span>
                    <span className="font-semibold text-blue-600">{session.user.profileCompleteness || 60}%</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${session.user.profileCompleteness || 60}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Resume Insights Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-green-600 text-lg">📝</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">Resume Insights</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold mt-0.5">!</div>
                    <span className="text-sm text-slate-700">Add more specific achievements with metrics to your experience</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold mt-0.5">✓</div>
                    <span className="text-sm text-slate-700">Your technical skills section is strong</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5">💡</div>
                    <span className="text-sm text-slate-700">Consider adding a portfolio link to showcase your work</span>
                  </li>
                </ul>
              </div>
              
              {/* Upcoming Events Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-blue-600 text-lg">📅</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">Upcoming Events</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { 
                      title: "Tech Career Fair", 
                      date: "Aug 25, 2025",
                      time: "10:00 AM - 4:00 PM", 
                      virtual: true,
                      color: "blue"
                    },
                    { 
                      title: "Resume Workshop", 
                      date: "Aug 30, 2025",
                      time: "1:00 PM - 3:00 PM", 
                      virtual: true,
                      color: "green"
                    },
                  ].map((event, i) => (
                    <div key={i} className={`p-4 rounded-xl bg-gradient-to-r from-${event.color}-50 to-${event.color}-100 border border-${event.color}-200`}>
                      <div className="font-semibold text-slate-900 mb-1">{event.title}</div>
                      <div className="text-sm text-slate-600 mb-2">{event.date}, {event.time}</div>
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-white/80 text-xs font-medium text-slate-700 rounded-full">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        {event.virtual ? 'Virtual Event' : 'In-person'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
