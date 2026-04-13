-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `originalPrice` INTEGER NULL,
    `discountRate` INTEGER NULL,
    `rating` DOUBLE NULL,
    `reviewCount` INTEGER NOT NULL DEFAULT 0,
    `isFreeShipping` BOOLEAN NOT NULL DEFAULT false,
    `badge` ENUM('BEST', 'NEW') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
