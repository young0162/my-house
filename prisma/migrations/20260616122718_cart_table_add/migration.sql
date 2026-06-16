-- CreateTable
CREATE TABLE `cart` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `product_id` INTEGER NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `cart_user_id_idx`(`user_id`),
    INDEX `cart_product_id_idx`(`product_id`),
    UNIQUE INDEX `cart_user_id_product_id_key`(`user_id`, `product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
