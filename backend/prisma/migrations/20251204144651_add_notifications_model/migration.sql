-- CreateTable
CREATE TABLE `Notification` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `link` VARCHAR(191) NULL,
    `user_ID` INTEGER NOT NULL,

    INDEX `Notification_user_ID_idx`(`user_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_user_ID_fkey` FOREIGN KEY (`user_ID`) REFERENCES `User`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
