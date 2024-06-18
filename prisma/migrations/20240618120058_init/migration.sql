-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "profileImageUrl" TEXT,
    "lastSignInAt" TIMESTAMP(3),
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "personId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "loggedOrganizationId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Username" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Username_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Username_username_organizationId_key" ON "Username"("username", "organizationId");

-- AddForeignKey
ALTER TABLE "Username" ADD CONSTRAINT "Username_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
