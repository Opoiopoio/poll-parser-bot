/*
  Warnings:

  - The primary key for the `PollOption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserPollOptions` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Poll` DROP FOREIGN KEY `Poll_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserPollOptions` DROP FOREIGN KEY `UserPollOptions_option_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserPollOptions` DROP FOREIGN KEY `UserPollOptions_user_id_fkey`;

-- DropIndex
DROP INDEX `Poll_author_id_fkey` ON `Poll`;

-- DropIndex
DROP INDEX `UserPollOptions_user_id_fkey` ON `UserPollOptions`;

-- AlterTable
ALTER TABLE `Poll` MODIFY `author_id` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `PollOption` DROP PRIMARY KEY,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `id` BIGINT NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `UserPollOptions` DROP PRIMARY KEY,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    MODIFY `option_id` BIGINT NULL,
    MODIFY `user_id` BIGINT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `UserPollOptions` ADD CONSTRAINT `UserPollOptions_option_id_fkey` FOREIGN KEY (`option_id`) REFERENCES `PollOption`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPollOptions` ADD CONSTRAINT `UserPollOptions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Poll` ADD CONSTRAINT `Poll_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
