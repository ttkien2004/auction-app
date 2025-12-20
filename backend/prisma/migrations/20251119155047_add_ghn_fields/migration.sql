-- AlterTable
ALTER TABLE `User` ADD COLUMN `ghn_district_id` INTEGER NULL,
    ADD COLUMN `ghn_province_id` INTEGER NULL,
    ADD COLUMN `ghn_ward_code` VARCHAR(191) NULL;
