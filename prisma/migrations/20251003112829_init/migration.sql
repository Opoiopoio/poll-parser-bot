/*
  Warnings:

  - You are about to drop the column `userId` on the `Poll` table. All the data in the column will be lost.
  - Added the required column `author_id` to the `Poll` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Poll` DROP FOREIGN KEY `Poll_userId_fkey`;

-- DropIndex
DROP INDEX `Poll_userId_fkey` ON `Poll`;

-- AlterTable
ALTER TABLE `Poll` DROP COLUMN `userId`,
    ADD COLUMN `author_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Poll` ADD CONSTRAINT `Poll_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
