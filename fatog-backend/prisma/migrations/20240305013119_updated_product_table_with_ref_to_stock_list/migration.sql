/*
  Warnings:

  - You are about to drop the column `productId` on the `StockList` table. All the data in the column will be lost.
  - Added the required column `productRefId` to the `StockList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `StockList` DROP FOREIGN KEY `StockList_productId_fkey`;

-- AlterTable
ALTER TABLE `StockList` DROP COLUMN `productId`,
    ADD COLUMN `productRefId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `StockList` ADD CONSTRAINT `StockList_productRefId_fkey` FOREIGN KEY (`productRefId`) REFERENCES `Product`(`refId`) ON DELETE RESTRICT ON UPDATE CASCADE;
