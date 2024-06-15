-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "profileImageUrl" TEXT NOT NULL,
    "lastSignInAt" TIMESTAMP(3),
    "banned" BOOLEAN NOT NULL,
    "blocked" BOOLEAN NOT NULL,
    "organizationId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Username" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Username_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Username_username_organizationId_key" ON "Username"("username", "organizationId");

-- AddForeignKey
ALTER TABLE "Username" ADD CONSTRAINT "Username_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
