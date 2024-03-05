/*
  Warnings:

  - You are about to drop the column `productId` on the `OrderList` table. All the data in the column will be lost.
  - Added the required column `productRefId` to the `OrderList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `OrderList` DROP FOREIGN KEY `OrderList_productId_fkey`;

-- AlterTable
ALTER TABLE `OrderList` DROP COLUMN `productId`,
    ADD COLUMN `productRefId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `OrderList` ADD CONSTRAINT `OrderList_productRefId_fkey` FOREIGN KEY (`productRefId`) REFERENCES `Product`(`refId`) ON DELETE RESTRICT ON UPDATE CASCADE;
