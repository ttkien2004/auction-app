-- CreateTable
CREATE TABLE `Watchlist` (
    `user_ID` INTEGER NOT NULL,
    `product_ID` INTEGER NOT NULL,
    `added_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`user_ID`, `product_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Watchlist` ADD CONSTRAINT `Watchlist_user_ID_fkey` FOREIGN KEY (`user_ID`) REFERENCES `User`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Watchlist` ADD CONSTRAINT `Watchlist_product_ID_fkey` FOREIGN KEY (`product_ID`) REFERENCES `Product`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
