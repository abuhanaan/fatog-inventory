/*
  Warnings:

  - You are about to drop the column `totalPrice` on the `OrderList` table. All the data in the column will be lost.
  - Made the column `customerId` on table `Customer` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `totalAmount` to the `OrderList` table without a default value. This is not possible if the table is not empty.
  - Made the column `staffId` on table `Staff` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Customer` DROP FOREIGN KEY `Customer_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `Staff` DROP FOREIGN KEY `Staff_staffId_fkey`;

-- AlterTable
ALTER TABLE `Customer` MODIFY `customerId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `OrderList` DROP COLUMN `totalPrice`,
    ADD COLUMN `totalAmount` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Staff` MODIFY `staffId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Staff` ADD CONSTRAINT `Staff_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;