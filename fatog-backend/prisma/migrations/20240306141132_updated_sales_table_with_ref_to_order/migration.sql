/*
  Warnings:

  - You are about to drop the column `orderId` on the `Sales` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderRefId]` on the table `Sales` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderRefId` to the `Sales` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Sales` DROP FOREIGN KEY `Sales_orderId_fkey`;

-- AlterTable
ALTER TABLE `Sales` DROP COLUMN `orderId`,
    ADD COLUMN `orderRefId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Sales_orderRefId_key` ON `Sales`(`orderRefId`);

-- AddForeignKey
ALTER TABLE `Sales` ADD CONSTRAINT `Sales_orderRefId_fkey` FOREIGN KEY (`orderRefId`) REFERENCES `Order`(`refId`) ON DELETE RESTRICT ON UPDATE CASCADE;
