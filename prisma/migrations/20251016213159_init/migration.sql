-- CreateTable
CREATE TABLE `User` (
    `id` BIGINT NOT NULL,
    `is_bot` BOOLEAN NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NULL,
    `username` VARCHAR(191) NULL,
    `language_code` VARCHAR(191) NULL,
    `is_premium` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSettings` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `statistic_format` VARCHAR(191) NOT NULL DEFAULT 'tag',

    UNIQUE INDEX `UserSettings_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPollOptions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `option_id` BIGINT NULL,
    `user_id` BIGINT NULL,

    INDEX `UserPollOptions_option_id_user_id_idx`(`option_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PollOption` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `voter_count` INTEGER NOT NULL,
    `poll_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PollStatisticMessage` (
    `id` BIGINT NOT NULL,
    `poll_id` VARCHAR(191) NOT NULL,
    `chat_id` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Poll` (
    `id` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `allows_multiple_answers` BOOLEAN NOT NULL,
    `author_id` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserSettings` ADD CONSTRAINT `UserSettings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPollOptions` ADD CONSTRAINT `UserPollOptions_option_id_fkey` FOREIGN KEY (`option_id`) REFERENCES `PollOption`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPollOptions` ADD CONSTRAINT `UserPollOptions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PollOption` ADD CONSTRAINT `PollOption_poll_id_fkey` FOREIGN KEY (`poll_id`) REFERENCES `Poll`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PollStatisticMessage` ADD CONSTRAINT `PollStatisticMessage_poll_id_fkey` FOREIGN KEY (`poll_id`) REFERENCES `Poll`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Poll` ADD CONSTRAINT `Poll_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
