-- AlterTable
ALTER TABLE `Projeto` ADD COLUMN `created_by` INTEGER NOT NULL DEFAULT -1;

-- AddForeignKey
ALTER TABLE `Projeto` ADD CONSTRAINT `Projeto_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
