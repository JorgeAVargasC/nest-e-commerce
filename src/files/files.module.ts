import { Module } from '@nestjs/common'
import { FilesService } from './files.service'
import { FilesController } from './files.controller'
import { CloudinaryProvider } from './providers'

@Module({
	controllers: [FilesController],
	providers: [CloudinaryProvider, FilesService],
	exports: [CloudinaryProvider, FilesService]
})
export class FilesModule {}
