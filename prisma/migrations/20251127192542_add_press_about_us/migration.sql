-- CreateTable
CREATE TABLE "PressAboutUs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dateReleased" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PressAboutUs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PressAboutUs_status_idx" ON "PressAboutUs"("status");

-- CreateIndex
CREATE INDEX "PressAboutUs_dateReleased_idx" ON "PressAboutUs"("dateReleased");
