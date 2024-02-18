/*
  Warnings:

  - Added the required column `staffId` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Stock` ADD COLUMN `staffId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Stock` ADD CONSTRAINT `Stock_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `Staff`(`staffId`) ON DELETE RESTRICT ON UPDATE CASCADE;
