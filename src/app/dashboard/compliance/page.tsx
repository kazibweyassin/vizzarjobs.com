"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { Shield, FileText, ArrowRight, Check, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { ComplianceStatusCard } from '~/components/ComplianceStatusCard';

export default function DashboardCompliancePage() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock compliance data
  const complianceData = [
    {
      id: "job-123",
      title: "Senior AI Engineer",
      candidateName: "David Chen",
      status: "in-progress",
      daysRemaining: 10,
      submissionDate: new Date(2025, 9, 15), // Oct 15, 2025
      estimatedCompletionDate: new Date(2025, 9, 25), // Oct 25, 2025
    },
    {
      id: "job-456",
      title: "Lead DevOps Specialist",
      candidateName: "Amara Okafor",
      status: "approved",
      daysRemaining: 0,
      submissionDate: new Date(2025, 9, 1), // Oct 1, 2025
      estimatedCompletionDate: new Date(2025, 9, 12), // Oct 12, 2025
    },
    {
      id: "job-789",
      title: "Senior ML Engineer",
      candidateName: "Marco Silva",
      status: "pending",
      daysRemaining: 14,
      submissionDate: null,
      estimatedCompletionDate: null,
    }
  ];
  
  // Mock compliance metrics
  const metrics = {
    avgProcessingDays: 12.3,
    successRate: 96.5,
    totalApprovals: 42,
    upcomingRenewals: 3
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Employer Compliance Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor and manage your Global Talent Stream (GTS) applications and compliance requirements
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded-lg font-medium transition-colors">
            <FileText className="w-5 h-5" />
            <span>New GTS Application</span>
          </button>
        </div>
      </div>
      
      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-sm font-medium text-gray-500">Avg. Processing</div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold text-gray-900">{metrics.avgProcessingDays} days</div>
              <div className="text-sm text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <Check className="w-4 h-4" /> Under 14-day target
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-sm font-medium text-gray-500">Success Rate</div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold text-gray-900">{metrics.successRate}%</div>
              <div className="text-sm text-blue-600 font-medium mt-1">
                First-time approval rate
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-sm font-medium text-gray-500">Total Approvals</div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold text-gray-900">{metrics.totalApprovals}</div>
              <div className="text-sm text-purple-600 font-medium mt-1">
                Successful GTS approvals
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-sm font-medium text-gray-500">Upcoming Renewals</div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold text-gray-900">{metrics.upcomingRenewals}</div>
              <div className="text-sm text-amber-600 font-medium mt-1">
                Due within 30 days
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="mb-10">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Active Applications</TabsTrigger>
          <TabsTrigger value="lmbp">LMBP Reports</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ComplianceStatusCard />
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {complianceData.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        item.status === 'approved' ? 'bg-green-100' : 
                        item.status === 'in-progress' ? 'bg-blue-100' : 
                        'bg-gray-100'
                      }`}>
                        {item.status === 'approved' ? (
                          <Check className={`w-5 h-5 text-green-600`} />
                        ) : item.status === 'in-progress' ? (
                          <Clock className={`w-5 h-5 text-blue-600`} />
                        ) : (
                          <FileText className={`w-5 h-5 text-gray-600`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500">
                          {item.candidateName}
                          {item.submissionDate && ` • ${format(item.submissionDate, 'MMM d, yyyy')}`}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                  
                  <button className="w-full text-center text-blue-600 font-medium text-sm hover:underline mt-4">
                    View All Applications
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="applications">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Active GTS Applications</h3>
            <p className="text-gray-600">
              Monitor the status of your current Global Talent Stream applications
            </p>
            
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6">
                {complianceData.map((item, index) => (
                  <div key={index} className={`flex items-center gap-4 p-4 ${
                    index !== complianceData.length - 1 ? 'border-b' : ''
                  }`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      item.status === 'approved' ? 'bg-green-100' : 
                      item.status === 'in-progress' ? 'bg-blue-100' : 
                      'bg-gray-100'
                    }`}>
                      {item.status === 'approved' ? (
                        <Check className={`w-5 h-5 text-green-600`} />
                      ) : item.status === 'in-progress' ? (
                        <Clock className={`w-5 h-5 text-blue-600`} />
                      ) : (
                        <FileText className={`w-5 h-5 text-gray-600`} />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.candidateName}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-medium ${
                        item.status === 'approved' ? 'text-green-600' : 
                        item.status === 'in-progress' ? 'text-blue-600' : 
                        'text-gray-600'
                      }`}>
                        {item.status === 'approved' ? 'Approved' : 
                         item.status === 'in-progress' ? `${item.daysRemaining} days remaining` : 
                         'Ready to submit'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.submissionDate ? 
                          `Submitted ${format(item.submissionDate, 'MMM d, yyyy')}` : 
                          'Not yet submitted'}
                      </div>
                    </div>
                    
                    <button className="text-blue-600 hover:text-blue-800">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="lmbp">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Labour Market Benefits Plan</h3>
            <p className="text-gray-600">
              Manage and track your LMBP commitments and annual reporting requirements
            </p>
            
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <p>LMBP reporting features will be available in the next release.</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="documents">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Compliance Documents</h3>
            <p className="text-gray-600">
              Access and download all your GTS compliance documentation
            </p>
            
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <p>Document management features will be available in the next release.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}