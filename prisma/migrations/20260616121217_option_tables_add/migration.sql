-- CreateTable
CREATE TABLE `product_option` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `option_type_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,

    INDEX `product_option_product_id_idx`(`product_id`),
    INDEX `product_option_option_type_id_idx`(`option_type_id`),
    UNIQUE INDEX `product_option_product_id_option_type_id_key`(`product_id`, `option_type_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `option_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    INDEX `option_type_name_idx`(`name`),
    UNIQUE INDEX `option_type_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `option_value` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(100) NOT NULL,
    `type_id` INTEGER NOT NULL,

    INDEX `option_value_type_id_idx`(`type_id`),
    UNIQUE INDEX `option_value_type_id_value_key`(`type_id`, `value`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_option` ADD CONSTRAINT `product_option_option_type_id_fkey` FOREIGN KEY (`option_type_id`) REFERENCES `option_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_option` ADD CONSTRAINT `product_option_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `option_value` ADD CONSTRAINT `option_value_type_id_fkey` FOREIGN KEY (`type_id`) REFERENCES `option_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
