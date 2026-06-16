/*
  Warnings:

  - You are about to drop the column `discount_rate` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `review_count` on the `product` table. All the data in the column will be lost.
  - Added the required column `rating` to the `review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `discount_rate`,
    DROP COLUMN `rating`,
    DROP COLUMN `review_count`,
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `stock` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `review` ADD COLUMN `rating` INTEGER NOT NULL;
