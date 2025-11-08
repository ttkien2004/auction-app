/*
  Warnings:

  - The primary key for the `Auction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `auction_end_time` on the `Auction` table. All the data in the column will be lost.
  - You are about to drop the column `auction_start_time` on the `Auction` table. All the data in the column will be lost.
  - You are about to drop the column `current_highest_bid_id` on the `Auction` table. All the data in the column will be lost.
  - You are about to drop the column `min_bid_increment` on the `Auction` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `Auction` table. All the data in the column will be lost.
  - The primary key for the `Bid` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `auction_product_id` on the `Bid` table. All the data in the column will be lost.
  - You are about to drop the column `bid_id` on the `Bid` table. All the data in the column will be lost.
  - You are about to drop the column `bidder_id` on the `Bid` table. All the data in the column will be lost.
  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category_id` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `parent_category_id` on the `Category` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - The primary key for the `DirectSale` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `product_id` on the `DirectSale` table. All the data in the column will be lost.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `condition` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `listing_type` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `seller_id` on the `Product` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `review_id` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `reviewed_user_id` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `reviewer_id` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `Review` table. All the data in the column will be lost.
  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `buyer_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `seller_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_type` on the `Transaction` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rating_average` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `phone_number` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to drop the `Product_Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Watchlist` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `auc_end_time` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `auc_start_time` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_ID` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ID` to the `Bid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `auction_ID` to the `Bid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyer_ID` to the `Bid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ID` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_ID` to the `DirectSale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ID` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_ID` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller_ID` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ID` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyer_ID` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_ID` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ID` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyer_ID` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ID` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Auction` DROP FOREIGN KEY `Auction_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `Bid` DROP FOREIGN KEY `Bid_auction_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `Bid` DROP FOREIGN KEY `Bid_bidder_id_fkey`;

-- DropForeignKey
ALTER TABLE `Category` DROP FOREIGN KEY `Category_parent_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `DirectSale` DROP FOREIGN KEY `DirectSale_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_seller_id_fkey`;

-- DropForeignKey
ALTER TABLE `Product_Image` DROP FOREIGN KEY `Product_Image_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_reviewed_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_reviewer_id_fkey`;

-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_transaction_id_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_buyer_id_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_seller_id_fkey`;

-- DropForeignKey
ALTER TABLE `Watchlist` DROP FOREIGN KEY `Watchlist_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `Watchlist` DROP FOREIGN KEY `Watchlist_user_id_fkey`;

-- DropIndex
DROP INDEX `Bid_auction_product_id_fkey` ON `Bid`;

-- DropIndex
DROP INDEX `Bid_bidder_id_fkey` ON `Bid`;

-- DropIndex
DROP INDEX `Category_parent_category_id_fkey` ON `Category`;

-- DropIndex
DROP INDEX `Product_category_id_fkey` ON `Product`;

-- DropIndex
DROP INDEX `Product_seller_id_fkey` ON `Product`;

-- DropIndex
DROP INDEX `Review_reviewed_user_id_fkey` ON `Review`;

-- DropIndex
DROP INDEX `Review_reviewer_id_fkey` ON `Review`;

-- DropIndex
DROP INDEX `Review_transaction_id_fkey` ON `Review`;

-- DropIndex
DROP INDEX `Transaction_buyer_id_fkey` ON `Transaction`;

-- DropIndex
DROP INDEX `Transaction_product_id_key` ON `Transaction`;

-- DropIndex
DROP INDEX `Transaction_seller_id_fkey` ON `Transaction`;

-- AlterTable
ALTER TABLE `Auction` DROP PRIMARY KEY,
    DROP COLUMN `auction_end_time`,
    DROP COLUMN `auction_start_time`,
    DROP COLUMN `current_highest_bid_id`,
    DROP COLUMN `min_bid_increment`,
    DROP COLUMN `product_id`,
    ADD COLUMN `auc_end_time` DATETIME(0) NOT NULL,
    ADD COLUMN `auc_start_time` DATETIME(0) NOT NULL,
    ADD COLUMN `min_bid_incr` DECIMAL(10, 2) NULL,
    ADD COLUMN `product_ID` INTEGER NOT NULL,
    MODIFY `start_price` DECIMAL(10, 2) NOT NULL,
    ADD PRIMARY KEY (`product_ID`);

-- AlterTable
ALTER TABLE `Bid` DROP PRIMARY KEY,
    DROP COLUMN `auction_product_id`,
    DROP COLUMN `bid_id`,
    DROP COLUMN `bidder_id`,
    ADD COLUMN `ID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `auction_ID` INTEGER NOT NULL,
    ADD COLUMN `buyer_ID` INTEGER NOT NULL,
    MODIFY `bid_amount` DECIMAL(10, 2) NOT NULL,
    MODIFY `bid_time` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD PRIMARY KEY (`ID`);

-- AlterTable
ALTER TABLE `Category` DROP PRIMARY KEY,
    DROP COLUMN `category_id`,
    DROP COLUMN `parent_category_id`,
    ADD COLUMN `ID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `parent_category_ID` INTEGER NULL,
    MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `description` TEXT NULL,
    ADD PRIMARY KEY (`ID`);

-- AlterTable
ALTER TABLE `DirectSale` DROP PRIMARY KEY,
    DROP COLUMN `product_id`,
    ADD COLUMN `product_ID` INTEGER NOT NULL,
    MODIFY `buy_now_price` DECIMAL(10, 2) NOT NULL,
    ADD PRIMARY KEY (`product_ID`);

-- AlterTable
ALTER TABLE `Product` DROP PRIMARY KEY,
    DROP COLUMN `category_id`,
    DROP COLUMN `condition`,
    DROP COLUMN `listing_type`,
    DROP COLUMN `product_id`,
    DROP COLUMN `seller_id`,
    ADD COLUMN `ID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `category_ID` INTEGER NOT NULL,
    ADD COLUMN `pcondition` VARCHAR(50) NULL,
    ADD COLUMN `seller_ID` INTEGER NOT NULL,
    ADD COLUMN `type` VARCHAR(50) NULL,
    MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `status` VARCHAR(50) NULL,
    MODIFY `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD PRIMARY KEY (`ID`);

-- AlterTable
ALTER TABLE `Review` DROP PRIMARY KEY,
    DROP COLUMN `review_id`,
    DROP COLUMN `reviewed_user_id`,
    DROP COLUMN `reviewer_id`,
    DROP COLUMN `transaction_id`,
    ADD COLUMN `ID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `buyer_ID` INTEGER NOT NULL,
    ADD COLUMN `transaction_ID` INTEGER NOT NULL,
    MODIFY `comment` TEXT NULL,
    MODIFY `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD PRIMARY KEY (`ID`);

-- AlterTable
ALTER TABLE `Transaction` DROP PRIMARY KEY,
    DROP COLUMN `buyer_id`,
    DROP COLUMN `product_id`,
    DROP COLUMN `seller_id`,
    DROP COLUMN `transaction_id`,
    DROP COLUMN `transaction_type`,
    ADD COLUMN `ID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `buyer_ID` INTEGER NOT NULL,
    ADD COLUMN `item_type` VARCHAR(50) NULL,
    ADD COLUMN `product_ID` INTEGER NULL,
    MODIFY `final_amount` DECIMAL(10, 2) NOT NULL,
    MODIFY `status` VARCHAR(50) NULL DEFAULT 'pending',
    MODIFY `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD PRIMARY KEY (`ID`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `created_at`,
    DROP COLUMN `full_name`,
    DROP COLUMN `password_hash`,
    DROP COLUMN `rating_average`,
    DROP COLUMN `user_id`,
    ADD COLUMN `ID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `name` VARCHAR(100) NULL,
    ADD COLUMN `password` VARCHAR(255) NOT NULL,
    MODIFY `username` VARCHAR(50) NOT NULL,
    MODIFY `email` VARCHAR(100) NOT NULL,
    MODIFY `address` VARCHAR(255) NULL,
    MODIFY `phone_number` VARCHAR(20) NULL,
    ADD PRIMARY KEY (`ID`);

-- DropTable
DROP TABLE `Product_Image`;

-- DropTable
DROP TABLE `Watchlist`;

-- CreateTable
CREATE TABLE `Buyer` (
    `user_ID` INTEGER NOT NULL,

    PRIMARY KEY (`user_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Seller` (
    `user_ID` INTEGER NOT NULL,

    PRIMARY KEY (`user_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `auction_ID` ON `Bid`(`auction_ID`);

-- CreateIndex
CREATE INDEX `buyer_ID` ON `Bid`(`buyer_ID`);

-- CreateIndex
CREATE INDEX `parent_category_ID` ON `Category`(`parent_category_ID`);

-- CreateIndex
CREATE INDEX `category_ID` ON `Product`(`category_ID`);

-- CreateIndex
CREATE INDEX `seller_ID` ON `Product`(`seller_ID`);

-- CreateIndex
CREATE INDEX `buyer_ID` ON `Review`(`buyer_ID`);

-- CreateIndex
CREATE INDEX `transaction_ID` ON `Review`(`transaction_ID`);

-- CreateIndex
CREATE INDEX `buyer_ID` ON `Transaction`(`buyer_ID`);

-- CreateIndex
CREATE INDEX `product_ID` ON `Transaction`(`product_ID`);

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_ibfk_1` FOREIGN KEY (`parent_category_ID`) REFERENCES `Category`(`ID`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_ibfk_1` FOREIGN KEY (`seller_ID`) REFERENCES `Seller`(`user_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_ibfk_2` FOREIGN KEY (`category_ID`) REFERENCES `Category`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DirectSale` ADD CONSTRAINT `DirectSale_ibfk_1` FOREIGN KEY (`product_ID`) REFERENCES `Product`(`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Auction` ADD CONSTRAINT `Auction_ibfk_1` FOREIGN KEY (`product_ID`) REFERENCES `Product`(`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Bid` ADD CONSTRAINT `Bid_ibfk_1` FOREIGN KEY (`buyer_ID`) REFERENCES `Buyer`(`user_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Bid` ADD CONSTRAINT `Bid_ibfk_2` FOREIGN KEY (`auction_ID`) REFERENCES `Auction`(`product_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_ibfk_1` FOREIGN KEY (`buyer_ID`) REFERENCES `Buyer`(`user_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_ibfk_2` FOREIGN KEY (`product_ID`) REFERENCES `Product`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_ibfk_1` FOREIGN KEY (`buyer_ID`) REFERENCES `Buyer`(`user_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_ibfk_2` FOREIGN KEY (`transaction_ID`) REFERENCES `Transaction`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Buyer` ADD CONSTRAINT `Buyer_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `User`(`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Seller` ADD CONSTRAINT `Seller_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `User`(`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `User_email_key` TO `email`;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `User_username_key` TO `username`;
