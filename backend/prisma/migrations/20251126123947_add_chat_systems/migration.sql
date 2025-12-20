-- CreateTable
CREATE TABLE `Conversation` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `buyer_ID` INTEGER NOT NULL,
    `seller_ID` INTEGER NOT NULL,
    `product_ID` INTEGER NULL,

    UNIQUE INDEX `Conversation_buyer_ID_seller_ID_product_ID_key`(`buyer_ID`, `seller_ID`, `product_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sender_ID` INTEGER NOT NULL,
    `conversation_ID` INTEGER NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_buyer_ID_fkey` FOREIGN KEY (`buyer_ID`) REFERENCES `User`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_seller_ID_fkey` FOREIGN KEY (`seller_ID`) REFERENCES `User`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_product_ID_fkey` FOREIGN KEY (`product_ID`) REFERENCES `Product`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_conversation_ID_fkey` FOREIGN KEY (`conversation_ID`) REFERENCES `Conversation`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_sender_ID_fkey` FOREIGN KEY (`sender_ID`) REFERENCES `User`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
