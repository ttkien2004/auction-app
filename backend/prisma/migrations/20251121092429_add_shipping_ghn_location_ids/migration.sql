-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `expected_delivery_time` DATETIME(3) NULL,
    ADD COLUMN `shipping_district_id` INTEGER NULL,
    ADD COLUMN `shipping_province_id` INTEGER NULL,
    ADD COLUMN `shipping_ward_code` VARCHAR(191) NULL;
