/*
  Warnings:

  - You are about to drop the column `orderId` on the `OrderList` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderRefId` to the `OrderList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `OrderList` DROP FOREIGN KEY `OrderList_orderId_fkey`;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `refId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `OrderList` DROP COLUMN `orderId`,
    ADD COLUMN `orderRefId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Order_refId_key` ON `Order`(`refId`);

-- AddForeignKey
ALTER TABLE `OrderList` ADD CONSTRAINT `OrderList_orderRefId_fkey` FOREIGN KEY (`orderRefId`) REFERENCES `Order`(`refId`) ON DELETE RESTRICT ON UPDATE CASCADE;
