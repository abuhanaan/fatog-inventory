/*
  Warnings:

  - Made the column `stockItemRefId` on table `InventoryHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `InventoryHistory` DROP FOREIGN KEY `InventoryHistory_stockItemRefId_fkey`;

-- AlterTable
ALTER TABLE `InventoryHistory` MODIFY `stockItemRefId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `InventoryHistory` ADD CONSTRAINT `InventoryHistory_stockItemRefId_fkey` FOREIGN KEY (`stockItemRefId`) REFERENCES `StockList`(`refId`) ON DELETE RESTRICT ON UPDATE CASCADE;
