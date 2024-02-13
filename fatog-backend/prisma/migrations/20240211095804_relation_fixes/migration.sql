/*
  Warnings:

  - You are about to drop the column `productId` on the `Stock` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Stock` DROP FOREIGN KEY `Stock_productId_fkey`;

-- AlterTable
ALTER TABLE `Stock` DROP COLUMN `productId`;
