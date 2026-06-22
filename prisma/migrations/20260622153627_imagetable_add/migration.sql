-- CreateTable
CREATE TABLE `product_image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `type` ENUM('THUMBNAIL', 'GALLERY', 'DETAIL') NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `alt` VARCHAR(191) NULL,

    INDEX `product_image_product_id_idx`(`product_id`),
    INDEX `product_image_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_image` ADD CONSTRAINT `product_image_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
