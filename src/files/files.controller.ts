import {
	Controller,
	Post,
	// Param,
	// Delete,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FilesService } from './files.service'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('product')
	@UseInterceptors(FileInterceptor('file'))
	uploadProductImage(@UploadedFile() file: Express.Multer.File) {
		return this.filesService.uploadFile(file)
	}

	// @Delete(':id')
	// remove(@Param('id') id: string) {
	// 	return this.filesService.deleteImage(+id)
	// }
}
