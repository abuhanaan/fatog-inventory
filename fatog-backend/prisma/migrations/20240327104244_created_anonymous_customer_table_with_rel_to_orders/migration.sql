-- AlterTable
ALTER TABLE `Order` ADD COLUMN `anonymousCustomerId` INTEGER NULL;

-- CreateTable
CREATE TABLE `AnonymousCustomer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `shippingAddress` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AnonymousCustomer_phoneNumber_key`(`phoneNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_anonymousCustomerId_fkey` FOREIGN KEY (`anonymousCustomerId`) REFERENCES `AnonymousCustomer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
