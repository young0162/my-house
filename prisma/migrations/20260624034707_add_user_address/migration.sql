-- CreateTable
CREATE TABLE `user_address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `recipient_name` VARCHAR(50) NOT NULL,
    `phone_number` VARCHAR(30) NOT NULL,
    `zip_code` VARCHAR(20) NULL,
    `address` VARCHAR(255) NOT NULL,
    `detail_address` VARCHAR(255) NULL,
    `is_default` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `user_address_user_id_is_default_idx`(`user_id`, `is_default`),
    INDEX `user_address_user_id_deleted_at_idx`(`user_id`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_address` ADD CONSTRAINT `user_address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
