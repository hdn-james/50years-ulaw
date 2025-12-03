"use client";

import { AlertCircle, CheckCircle, Eye, FileText, Loader2, TrendingUp, Users, XCircle } from "lucide-react";
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type HealthStatus = "operational" | "degraded" | "down";

interface ServiceHealth {
  status: HealthStatus;
  latency?: number;
  error?: string;
}

interface HealthCheckResponse {
  overall: HealthStatus;
  services: {
    database: ServiceHealth;
    api: ServiceHealth;
    contentManagement: ServiceHealth;
  };
  timestamp: string;
}

function getStatusIcon(status: HealthStatus) {
  switch (status) {
    case "operational":
      return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500" />;
    case "degraded":
      return <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />;
    case "down":
      return <XCircle className="w-4 h-4 text-red-600 dark:text-red-500" />;
  }
}

function getStatusColor(status: HealthStatus) {
  switch (status) {
    case "operational":
      return "text-green-600 dark:text-green-500";
    case "degraded":
      return "text-yellow-600 dark:text-yellow-500";
    case "down":
      return "text-red-600 dark:text-red-500";
  }
}

function getStatusDotColor(status: HealthStatus) {
  switch (status) {
    case "operational":
      return "bg-green-600 dark:bg-green-500";
    case "degraded":
      return "bg-yellow-600 dark:bg-yellow-500";
    case "down":
      return "bg-red-600 dark:bg-red-500";
  }
}

function getStatusLabel(status: HealthStatus) {
  switch (status) {
    case "operational":
      return "Operational";
    case "degraded":
      return "Degraded";
    case "down":
      return "Down";
  }
}

function getOverallDescription(status: HealthStatus | null, isLoading: boolean, error: string | null) {
  if (isLoading) return "Checking system status...";
  if (error) return "Unable to check system status";
  if (!status) return "Status unknown";

  switch (status) {
    case "operational":
      return "All systems operational";
    case "degraded":
      return "Some systems are experiencing issues";
    case "down":
      return "Systems are currently unavailable";
  }
}

interface StatusRowProps {
  label: string;
  service: ServiceHealth | null;
  isLoading: boolean;
}

function StatusRow({ label, service, isLoading }: StatusRowProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm">{label}</span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          Checking...
        </span>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm">{label}</span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-gray-400" />
          Unknown
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <span className={`text-xs ${getStatusColor(service.status)} flex items-center gap-1`}>
        <span className={`w-2 h-2 rounded-full ${getStatusDotColor(service.status)}`} />
        {getStatusLabel(service.status)}
        {service.latency !== undefined && service.status !== "down" && (
          <span className="text-muted-foreground ml-1">({service.latency}ms)</span>
        )}
      </span>
    </div>
  );
}

export default function AdminDashboard() {
  const [health, setHealth] = React.useState<HealthCheckResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchHealth = React.useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/health");
      if (!response.ok && response.status !== 503) {
        throw new Error("Failed to fetch health status");
      }
      const data: HealthCheckResponse = await response.json();
      setHealth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check system status");
      setHealth(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchHealth();

    // Refresh health status every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to the 50 Years ULAW admin panel</p>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>System Status</CardTitle>
            <CardDescription>{getOverallDescription(health?.overall ?? null, isLoading, error)}</CardDescription>
          </div>
          {!isLoading && (
            <button
              onClick={() => {
                setIsLoading(true);
                fetchHealth();
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Refresh
            </button>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          <div className="space-y-3">
            <StatusRow
              label="Content Management"
              service={health?.services.contentManagement ?? null}
              isLoading={isLoading}
            />
            <StatusRow label="Database" service={health?.services.database ?? null} isLoading={isLoading} />
            <StatusRow label="API" service={health?.services.api ?? null} isLoading={isLoading} />
          </div>
          {health?.timestamp && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Last checked: {new Date(health.timestamp).toLocaleTimeString()}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
