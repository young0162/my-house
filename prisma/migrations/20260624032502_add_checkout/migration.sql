-- CreateTable
CREATE TABLE `checkout` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `source` ENUM('PRODUCT_DETAIL', 'CART') NOT NULL,
    `status` ENUM('PENDING', 'EXPIRED', 'ORDERED') NOT NULL DEFAULT 'PENDING',
    `expires_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `checkout_user_id_status_created_at_idx`(`user_id`, `status`, `created_at`),
    INDEX `checkout_expires_at_idx`(`expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `checkout_item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `checkout_id` VARCHAR(191) NOT NULL,
    `product_id` INTEGER NOT NULL,
    `cart_id` INTEGER NULL,
    `quantity` INTEGER NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,

    INDEX `checkout_item_checkout_id_idx`(`checkout_id`),
    INDEX `checkout_item_product_id_idx`(`product_id`),
    INDEX `checkout_item_cart_id_idx`(`cart_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `checkout_item_option` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `checkout_item_id` INTEGER NOT NULL,
    `option_value_id` INTEGER NOT NULL,

    INDEX `checkout_item_option_checkout_item_id_idx`(`checkout_item_id`),
    INDEX `checkout_item_option_option_value_id_idx`(`option_value_id`),
    UNIQUE INDEX `checkout_item_option_checkout_item_id_option_value_id_key`(`checkout_item_id`, `option_value_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `checkout` ADD CONSTRAINT `checkout_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkout_item` ADD CONSTRAINT `checkout_item_checkout_id_fkey` FOREIGN KEY (`checkout_id`) REFERENCES `checkout`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkout_item` ADD CONSTRAINT `checkout_item_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkout_item_option` ADD CONSTRAINT `checkout_item_option_checkout_item_id_fkey` FOREIGN KEY (`checkout_item_id`) REFERENCES `checkout_item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkout_item_option` ADD CONSTRAINT `checkout_item_option_option_value_id_fkey` FOREIGN KEY (`option_value_id`) REFERENCES `option_value`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
