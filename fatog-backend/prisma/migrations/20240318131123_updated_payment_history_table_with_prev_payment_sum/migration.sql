/*
  Warnings:

  - Added the required column `prevPaymentSum` to the `PaymentHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PaymentHistory` ADD COLUMN `prevPaymentSum` INTEGER NOT NULL;
