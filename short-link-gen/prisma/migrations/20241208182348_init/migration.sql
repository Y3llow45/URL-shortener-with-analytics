-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "longUrl" TEXT NOT NULL,
    "shortSlug" TEXT NOT NULL,
    "visits" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_shortSlug_key" ON "Link"("shortSlug");
