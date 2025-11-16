-- CreateTable
CREATE TABLE `CartItem` (
    `buyer_ID` INTEGER NOT NULL,
    `product_ID` INTEGER NOT NULL,
    `added_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`buyer_ID`, `product_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_buyer_ID_fkey` FOREIGN KEY (`buyer_ID`) REFERENCES `Buyer`(`user_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_product_ID_fkey` FOREIGN KEY (`product_ID`) REFERENCES `Product`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
