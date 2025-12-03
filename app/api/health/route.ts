import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type HealthStatus = "operational" | "degraded" | "down";

export interface ServiceHealth {
  status: HealthStatus;
  latency?: number;
  error?: string;
}

export interface HealthCheckResponse {
  overall: HealthStatus;
  services: {
    database: ServiceHealth;
    api: ServiceHealth;
    contentManagement: ServiceHealth;
  };
  timestamp: string;
}

async function checkDatabase(): Promise<ServiceHealth> {
  const start = Date.now();
  try {
    // Simple query to verify database connectivity
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;
    return {
      status: latency > 1000 ? "degraded" : "operational",
      latency,
    };
  } catch (error) {
    return {
      status: "down",
      error: error instanceof Error ? error.message : "Database connection failed",
    };
  }
}

async function checkContentManagement(): Promise<ServiceHealth> {
  const start = Date.now();
  try {
    // Check if we can query the content table
    await prisma.content.findFirst({
      select: { id: true },
    });
    const latency = Date.now() - start;
    return {
      status: latency > 2000 ? "degraded" : "operational",
      latency,
    };
  } catch (error) {
    return {
      status: "down",
      error: error instanceof Error ? error.message : "Content management check failed",
    };
  }
}

function checkApi(): ServiceHealth {
  // If we've reached this point, the API is working
  return {
    status: "operational",
    latency: 0,
  };
}

function getOverallStatus(services: HealthCheckResponse["services"]): HealthStatus {
  const statuses = Object.values(services).map((s) => s.status);

  if (statuses.some((s) => s === "down")) {
    return "down";
  }
  if (statuses.some((s) => s === "degraded")) {
    return "degraded";
  }
  return "operational";
}

export async function GET() {
  try {
    const [database, contentManagement] = await Promise.all([
      checkDatabase(),
      checkContentManagement(),
    ]);

    const api = checkApi();

    const services = {
      database,
      api,
      contentManagement,
    };

    const response: HealthCheckResponse = {
      overall: getOverallStatus(services),
      services,
      timestamp: new Date().toISOString(),
    };

    const statusCode = response.overall === "operational" ? 200 :
                       response.overall === "degraded" ? 200 : 503;

    return NextResponse.json(response, { status: statusCode });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        overall: "down",
        services: {
          database: { status: "down", error: "Health check failed" },
          api: { status: "down", error: "Health check failed" },
          contentManagement: { status: "down", error: "Health check failed" },
        },
        timestamp: new Date().toISOString(),
      } satisfies HealthCheckResponse,
      { status: 503 }
    );
  }
}
