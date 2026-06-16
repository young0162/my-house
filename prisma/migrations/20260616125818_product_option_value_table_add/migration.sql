-- CreateTable
CREATE TABLE `product_option_value` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_option_id` INTEGER NOT NULL,
    `option_value_id` INTEGER NOT NULL,

    INDEX `product_option_value_product_option_id_idx`(`product_option_id`),
    INDEX `product_option_value_option_value_id_idx`(`option_value_id`),
    UNIQUE INDEX `product_option_value_product_option_id_option_value_id_key`(`product_option_id`, `option_value_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_option_value` ADD CONSTRAINT `product_option_value_product_option_id_fkey` FOREIGN KEY (`product_option_id`) REFERENCES `product_option`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_option_value` ADD CONSTRAINT `product_option_value_option_value_id_fkey` FOREIGN KEY (`option_value_id`) REFERENCES `option_value`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
