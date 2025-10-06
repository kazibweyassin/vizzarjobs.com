"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Calendar,
  MessageSquare,
  XCircle,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

interface ApplicationStatsProps {
  stats: {
    total: number;
    active: number;
    interviews: number;
    offers: number;
    rejected: number;
    responseRate: number;
  };
  className?: string;
}

export default function ApplicationStats({ stats, className = "" }: ApplicationStatsProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Total</span>
              <Calendar className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Active</span>
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Interviews</span>
              <MessageSquare className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold">{stats.interviews}</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Offers</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{stats.offers}</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Rejected</span>
              <XCircle className="h-4 w-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Response Rate</span>
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{stats.responseRate}%</div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
