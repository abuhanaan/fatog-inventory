/*
  Warnings:

  - You are about to drop the column `stockItemId` on the `InventoryHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stockItemRefId]` on the table `InventoryHistory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refId]` on the table `StockList` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refId` to the `StockList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `InventoryHistory` DROP FOREIGN KEY `InventoryHistory_stockItemId_fkey`;

-- AlterTable
ALTER TABLE `InventoryHistory` DROP COLUMN `stockItemId`,
    ADD COLUMN `stockItemRefId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `StockList` ADD COLUMN `refId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `InventoryHistory_stockItemRefId_key` ON `InventoryHistory`(`stockItemRefId`);

-- CreateIndex
CREATE UNIQUE INDEX `StockList_refId_key` ON `StockList`(`refId`);

-- AddForeignKey
ALTER TABLE `InventoryHistory` ADD CONSTRAINT `InventoryHistory_stockItemRefId_fkey` FOREIGN KEY (`stockItemRefId`) REFERENCES `StockList`(`refId`) ON DELETE SET NULL ON UPDATE CASCADE;
