-- CreateTable
CREATE TABLE `order` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `checkout_id` VARCHAR(191) NULL,
    `status` ENUM('PAID', 'SHIPPING', 'DELIVERED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PAID',
    `orderer_name` VARCHAR(100) NOT NULL,
    `orderer_email` VARCHAR(200) NOT NULL,
    `orderer_phone` VARCHAR(30) NOT NULL,
    `recipient_name` VARCHAR(50) NOT NULL,
    `recipient_phone` VARCHAR(30) NOT NULL,
    `zip_code` VARCHAR(20) NULL,
    `address` VARCHAR(255) NOT NULL,
    `detail_address` VARCHAR(255) NULL,
    `delivery_request` VARCHAR(200) NULL,
    `payment_method` VARCHAR(50) NOT NULL,
    `total_product_price` INTEGER NOT NULL,
    `shipping_fee` INTEGER NOT NULL DEFAULT 0,
    `coupon_discount` INTEGER NOT NULL DEFAULT 0,
    `point_discount` INTEGER NOT NULL DEFAULT 0,
    `final_price` INTEGER NOT NULL,
    `point_earned` INTEGER NOT NULL DEFAULT 0,
    `ordered_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `order_user_id_ordered_at_idx`(`user_id`, `ordered_at`),
    INDEX `order_status_ordered_at_idx`(`status`, `ordered_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(191) NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `brand_name` VARCHAR(100) NOT NULL,
    `product_image` VARCHAR(500) NOT NULL,
    `option_label` VARCHAR(300) NULL,
    `price` INTEGER NOT NULL,
    `original_price` INTEGER NULL,
    `quantity` INTEGER NOT NULL,
    `is_free_shipping` BOOLEAN NOT NULL DEFAULT false,
    `delivery_method` VARCHAR(100) NOT NULL,

    INDEX `order_item_order_id_idx`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_item` ADD CONSTRAINT `order_item_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
