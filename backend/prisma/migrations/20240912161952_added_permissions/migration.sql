-- CreateTable
CREATE TABLE `Permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create` BOOLEAN NOT NULL,
    `delete` BOOLEAN NOT NULL,
    `update` BOOLEAN NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `projetoId` INTEGER NOT NULL,

    UNIQUE INDEX `Permissions_usuarioId_projetoId_key`(`usuarioId`, `projetoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Permissions` ADD CONSTRAINT `Permissions_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Permissions` ADD CONSTRAINT `Permissions_projetoId_fkey` FOREIGN KEY (`projetoId`) REFERENCES `Projeto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
