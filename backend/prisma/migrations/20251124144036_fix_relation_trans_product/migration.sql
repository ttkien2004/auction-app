/*
  Warnings:

  - A unique constraint covering the columns `[product_ID]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Transaction_product_ID_key` ON `Transaction`(`product_ID`);
