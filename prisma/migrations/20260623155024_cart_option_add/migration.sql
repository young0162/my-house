-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `cart_user_id_fkey`;

-- DropIndex
DROP INDEX `cart_user_id_product_id_key` ON `cart`;

-- CreateTable
CREATE TABLE `cart_option` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cart_id` INTEGER NOT NULL,
    `option_value_id` INTEGER NOT NULL,

    INDEX `cart_option_cart_id_idx`(`cart_id`),
    INDEX `cart_option_option_value_id_idx`(`option_value_id`),
    UNIQUE INDEX `cart_option_cart_id_option_value_id_key`(`cart_id`, `option_value_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cart_option` ADD CONSTRAINT `cart_option_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_option` ADD CONSTRAINT `cart_option_option_value_id_fkey` FOREIGN KEY (`option_value_id`) REFERENCES `option_value`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
