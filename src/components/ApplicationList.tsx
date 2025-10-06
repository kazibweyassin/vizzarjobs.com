"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Building2, MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";

// Define application status types
type ApplicationStatus = 'APPLIED' | 'IN_REVIEW' | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'WITHDRAWN';

interface ApplicationListProps {
  applications: Array<{
    id: string;
    status: ApplicationStatus;
    notes?: string | null;
    createdAt: Date | string;
    lastActivity?: Date | string | null;
    job: {
      id: string;
      title: string;
      company: string;
      location?: string | null;
    };
  }>;
  emptyMessage: string;
}

const statusColors: Record<ApplicationStatus, string> = {
  APPLIED: "bg-blue-100 text-blue-800",
  IN_REVIEW: "bg-blue-100 text-blue-800",
  INTERVIEW: "bg-amber-100 text-amber-800",
  OFFER: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  WITHDRAWN: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  IN_REVIEW: "In Review",
  INTERVIEW: "Interview",
  OFFER: "Offer Received",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export default function ApplicationList({ applications, emptyMessage }: ApplicationListProps) {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const utils = api.useContext();
  const updateNotesMutation = api.applications.updateStatus.useMutation({
    onSuccess: () => {
      utils.applications.getMyApplications.invalidate();
    },
  });
  
  const withdrawMutation = api.applications.deleteApplication.useMutation({
    onSuccess: () => {
      utils.applications.getMyApplications.invalidate();
      utils.applications.getApplicationStats.invalidate();
    },
  });
  
  const handleUpdateNotes = async () => {
    if (!selectedAppId) return;
    
    try {
      await updateNotesMutation.mutateAsync({
        id: selectedAppId,
        notes,
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to update notes:", error);
    }
  };

  const handleWithdraw = async (id: string) => {
    try {
      await withdrawMutation.mutateAsync({ id });
    } catch (error) {
      console.error("Failed to withdraw application:", error);
    }
  };
  
  const openNotesDialog = (application: ApplicationListProps['applications'][0]) => {
    setSelectedAppId(application.id);
    setNotes(application.notes || "");
    setIsDialogOpen(true);
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {applications.map((application, i) => (
        <motion.div
          key={application.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-1">
                    <Link href={`/jobs/${application.job.id}`} className="hover:text-blue-600">
                      {application.job.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="flex items-center">
                    <Building2 className="h-4 w-4 mr-1" />
                    {typeof application.job.company === 'object' && application.job.company?.name 
                      ? application.job.company.name 
                      : typeof application.job.company === 'string' 
                        ? application.job.company 
                        : "Company"}
                  </CardDescription>
                </div>
                <Badge className={statusColors[application.status]}>
                  {statusLabels[application.status]}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Applied {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                </div>
                
                {application.job.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {application.job.location}
                  </div>
                )}
                
                {application.lastActivity && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    Last update {formatDistanceToNow(new Date(application.lastActivity), { addSuffix: true })}
                  </div>
                )}
              </div>
              
              {application.notes && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
                  <div className="font-medium mb-1 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" /> Your Notes
                  </div>
                  <p className="text-muted-foreground line-clamp-2">{application.notes}</p>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between bg-gray-50 border-t border-gray-100">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => openNotesDialog(application)}
              >
                {application.notes ? "Edit Notes" : "Add Notes"}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">Actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Manage Application</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/jobs/${application.job.id}`}>View Job Post</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openNotesDialog(application)}>
                    {application.notes ? "Edit Notes" : "Add Notes"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => handleWithdraw(application.id)}
                  >
                    Withdraw Application
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Notes</DialogTitle>
            <DialogDescription>
              Add notes about your application, interviews, or follow-ups.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about your application status, interview feedback, or reminders..."
            className="min-h-[150px]"
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateNotes}>
              Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
