/*
  Warnings:

  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_userId_fkey";

-- DropTable
DROP TABLE "profiles";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "ActiveStatus";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "Status";
