/*
  Warnings:

  - Changed the type of `password` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
DROP COLUMN "password",
ADD COLUMN     "password" TEXT NOT NULL;
