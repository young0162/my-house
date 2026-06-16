-- CreateTable
CREATE TABLE `coupon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `use_start_at` DATETIME(3) NOT NULL,
    `use_end_at` DATETIME(3) NOT NULL,
    `discount_percent` INTEGER NOT NULL,

    INDEX `coupon_use_start_at_use_end_at_idx`(`use_start_at`, `use_end_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_coupon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `coupon_id` INTEGER NOT NULL,

    INDEX `product_coupon_product_id_idx`(`product_id`),
    INDEX `product_coupon_coupon_id_idx`(`coupon_id`),
    UNIQUE INDEX `product_coupon_product_id_coupon_id_key`(`product_id`, `coupon_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_coupon` ADD CONSTRAINT `product_coupon_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_coupon` ADD CONSTRAINT `product_coupon_coupon_id_fkey` FOREIGN KEY (`coupon_id`) REFERENCES `coupon`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
