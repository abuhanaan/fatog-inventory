-- AlterTable
ALTER TABLE `Order` MODIFY `shippingAddress` VARCHAR(191) NULL,
    MODIFY `paymentStatus` VARCHAR(191) NULL,
    MODIFY `deliveryStatus` VARCHAR(191) NULL,
    MODIFY `amountPaid` INTEGER NULL,
    MODIFY `outStandingPayment` INTEGER NULL;
