/*
  Warnings:

  - Added the required column `chat_id` to the `PollStatisticMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PollStatisticMessage` ADD COLUMN `chat_id` BIGINT NOT NULL;
