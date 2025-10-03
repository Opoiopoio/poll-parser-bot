/*
  Warnings:

  - Added the required column `allows_multiple_answers` to the `Poll` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Poll` ADD COLUMN `allows_multiple_answers` BOOLEAN NOT NULL;
