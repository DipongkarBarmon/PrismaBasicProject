-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authoId_fkey" FOREIGN KEY ("authoId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
