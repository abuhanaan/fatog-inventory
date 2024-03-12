-- DropForeignKey
ALTER TABLE `InventoryHistory` DROP FOREIGN KEY `InventoryHistory_stockItemRefId_fkey`;

-- AlterTable
ALTER TABLE `InventoryHistory` MODIFY `stockItemRefId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `InventoryHistory` ADD CONSTRAINT `InventoryHistory_stockItemRefId_fkey` FOREIGN KEY (`stockItemRefId`) REFERENCES `StockList`(`refId`) ON DELETE SET NULL ON UPDATE CASCADE;
