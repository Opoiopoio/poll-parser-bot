/*
  Warnings:

  - You are about to drop the column `is_tag_format` on the `UserSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `UserSettings` DROP COLUMN `is_tag_format`,
    ADD COLUMN `statistic_format` VARCHAR(191) NOT NULL DEFAULT 'tag';
