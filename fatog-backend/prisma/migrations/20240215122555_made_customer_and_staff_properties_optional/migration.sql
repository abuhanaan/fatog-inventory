-- AlterTable
ALTER TABLE `Customer` MODIFY `phoneNumber` VARCHAR(191) NULL,
    MODIFY `shippingAddress` VARCHAR(191) NULL,
    MODIFY `gender` VARCHAR(191) NULL,
    MODIFY `firstName` VARCHAR(191) NULL,
    MODIFY `lastName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Staff` MODIFY `phoneNumber` VARCHAR(191) NULL,
    MODIFY `gender` VARCHAR(191) NULL,
    MODIFY `firstName` VARCHAR(191) NULL,
    MODIFY `lastName` VARCHAR(191) NULL;
