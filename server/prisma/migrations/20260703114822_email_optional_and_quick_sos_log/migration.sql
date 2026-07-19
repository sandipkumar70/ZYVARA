-- AlterTable
ALTER TABLE "TrustedContact" ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "QuickSOSLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "location" TEXT,
    "emergencyType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuickSOSLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuickSOSLog" ADD CONSTRAINT "QuickSOSLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
