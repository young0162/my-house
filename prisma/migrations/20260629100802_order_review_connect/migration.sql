/*
  Warnings:

  - A unique constraint covering the columns `[order_item_id]` on the table `review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order_item_id` to the `review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `review_product_id_fkey`;

-- AlterTable
ALTER TABLE `review` ADD COLUMN `order_item_id` INTEGER NOT NULL,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL,
    MODIFY `product_id` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `review_order_item_id_key` ON `review`(`order_item_id`);

-- CreateIndex
CREATE INDEX `review_user_id_idx` ON `review`(`user_id`);

-- CreateIndex
CREATE INDEX `review_order_item_id_idx` ON `review`(`order_item_id`);

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_order_item_id_fkey` FOREIGN KEY (`order_item_id`) REFERENCES `order_item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
