/*
  Warnings:

  - You are about to drop the column `stockId` on the `StockList` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refId]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refId` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockRefId` to the `StockList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `StockList` DROP FOREIGN KEY `StockList_stockId_fkey`;

-- AlterTable
ALTER TABLE `Stock` ADD COLUMN `refId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `StockList` DROP COLUMN `stockId`,
    ADD COLUMN `stockRefId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Stock_refId_key` ON `Stock`(`refId`);

-- AddForeignKey
ALTER TABLE `StockList` ADD CONSTRAINT `StockList_stockRefId_fkey` FOREIGN KEY (`stockRefId`) REFERENCES `Stock`(`refId`) ON DELETE RESTRICT ON UPDATE CASCADE;
