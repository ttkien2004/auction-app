-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `expected_delivery_date` DATETIME(3) NULL,
    ADD COLUMN `shipping_address` VARCHAR(191) NULL,
    ADD COLUMN `shipping_note` VARCHAR(191) NULL,
    ADD COLUMN `shipping_phone` VARCHAR(191) NULL;
