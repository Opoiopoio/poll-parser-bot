-- CreateTable
CREATE TABLE `PollStatisticMessage` (
    `id` BIGINT NOT NULL,
    `poll_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PollStatisticMessage` ADD CONSTRAINT `PollStatisticMessage_poll_id_fkey` FOREIGN KEY (`poll_id`) REFERENCES `Poll`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
