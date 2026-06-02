-- CreateTable
CREATE TABLE "Letter" (
    "id" SERIAL NOT NULL,
    "referencia" TEXT,
    "cite" TEXT,
    "sidoc" TEXT,
    "fecha" TEXT,
    "receptor" TEXT,
    "emisor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Letter_pkey" PRIMARY KEY ("id")
);
