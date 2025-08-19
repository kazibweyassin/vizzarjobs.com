import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, MapPin, Users, Building, Calendar, ExternalLink } from "lucide-react";
import { api } from "~/trpc/server";
import AnimatedHeading from "~/components/animations/AnimatedHeading";
import JobCard from "~/components/JobCard";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

// This follows the official Next.js type for App Router page props
type Props = {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  try {
    const company = await api.companies.getById({ id: params.id });
    
    if (!company) {
      return {
        title: "Company Not Found | VizzarJobs",
        description: "The requested company profile could not be found."
      };
    }
    
    return {
      title: `${company.name} | VizzarJobs`,
      description: company.description?.substring(0, 160) || `Jobs and company information for ${company.name}`,
    };
  } catch (error) {
    return {
      title: "Company | VizzarJobs",
      description: "Company information on VizzarJobs"
    };
  }
};

export default async function CompanyPage({ params }: Props) {
  try {
    const company = await api.companies.getById({ id: params.id });
    
    if (!company) {
      notFound();
    }
    
    const jobs = await api.jobs.getByCompany({ companyId: params.id });
    
    return (
      <div className="container py-8">
        <div className="bg-white rounded-xl overflow-hidden shadow-md mb-8">
          {/* Company Header */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-blue-800 relative">
            {company.coverImage && (
              <Image
                src={company.coverImage}
                alt={`${company.name} cover`}
                fill
                className="object-cover"
              />
            )}
          </div>
          
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-6">
              <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white bg-white shadow-md flex items-center justify-center">
                {company.logo ? (
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={128}
                    height={128}
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 text-blue-800 flex items-center justify-center text-4xl font-bold">
                    {company.name.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                <h1 className="text-3xl font-bold">{company.name}</h1>
                <p className="text-muted-foreground">{company.industry}</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex gap-4">
                {company.website && (
                  <Button variant="outline" asChild>
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  </Button>
                )}
                
                <Button>Follow Company</Button>
              </div>
            </div>
            
            {/* Company Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <AnimatedHeading level="h2" className="text-xl mb-4" underline>
                  About
                </AnimatedHeading>
                <p className="text-muted-foreground">
                  {company.description || "No company description available."}
                </p>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company.location && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                      <div>
                        <div className="font-medium">Location</div>
                        <div className="text-sm text-muted-foreground">{company.location}</div>
                      </div>
                    </div>
                  )}
                  
                  {company.size && (
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                      <div>
                        <div className="font-medium">Company Size</div>
                        <div className="text-sm text-muted-foreground">{company.size}</div>
                      </div>
                    </div>
                  )}
                  
                  {company.founded && (
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                      <div>
                        <div className="font-medium">Founded</div>
                        <div className="text-sm text-muted-foreground">{company.founded}</div>
                      </div>
                    </div>
                  )}
                  
                  {company.industry && (
                    <div className="flex items-start">
                      <Building className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                      <div>
                        <div className="font-medium">Industry</div>
                        <div className="text-sm text-muted-foreground">{company.industry}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <AnimatedHeading level="h2" className="text-xl mb-4" underline>
                  Perks & Benefits
                </AnimatedHeading>
                
                {company.benefits?.length ? (
                  <div className="grid grid-cols-2 gap-3">
                    {company.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No benefits information available.</p>
                )}
                
                {company.socials && Object.keys(company.socials).length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Connect with {company.name}</h3>
                    <div className="flex gap-3">
                      {company.socials.linkedin && (
                        <a 
                          href={company.socials.linkedin} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                        >
                          <ExternalLink className="h-5 w-5" />
                          <span className="sr-only">LinkedIn</span>
                        </a>
                      )}
                      {/* Add other social links as needed */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Jobs Tab */}
        <div>
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="jobs">Open Positions ({jobs.length})</TabsTrigger>
              <TabsTrigger value="reviews">Company Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="jobs">
              <div className="space-y-6">
                {jobs.length > 0 ? (
                  jobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      {company.name} currently has no open positions on VizzarJobs.
                    </p>
                    <Button asChild variant="outline">
                      <Link href="/jobs">
                        Browse All Jobs
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Company reviews coming soon!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching company:", error);
    notFound();
  }
}
