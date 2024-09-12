-- CreateTable
CREATE TABLE `Logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `projetoId` INTEGER NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `acao` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Logs` ADD CONSTRAINT `Logs_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Logs` ADD CONSTRAINT `Logs_projetoId_fkey` FOREIGN KEY (`projetoId`) REFERENCES `Projeto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
