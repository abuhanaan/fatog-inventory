/*
  Warnings:

  - You are about to drop the column `productId` on the `Inventory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productRefId]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productRefId` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Inventory` DROP FOREIGN KEY `Inventory_productId_fkey`;

-- AlterTable
ALTER TABLE `Inventory` DROP COLUMN `productId`,
    ADD COLUMN `productRefId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `refId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Inventory_productRefId_key` ON `Inventory`(`productRefId`);

-- CreateIndex
CREATE UNIQUE INDEX `Product_refId_key` ON `Product`(`refId`);

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_productRefId_fkey` FOREIGN KEY (`productRefId`) REFERENCES `Product`(`refId`) ON DELETE RESTRICT ON UPDATE CASCADE;
