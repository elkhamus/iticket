import {
    Controller,
    Delete,
    FileTypeValidator,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiProperty,
    ApiTags,
  } from '@nestjs/swagger';
  import { Roles } from 'src/shared/decorators/roles.decorator';
  import { UserRole } from 'src/shared/enum/user.enum';
  import { AuthGard } from 'src/guards/auth.guard';
  import { UploadService } from './upload.service';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Request } from 'express';
  
  @Controller('upload')
  @ApiTags('Upload')
  @ApiBearerAuth()
  export class UploadController {
    constructor(private uploadService: UploadService) {}
  
    @UseGuards(AuthGard)
    @Roles(UserRole.ADMIN)
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      required: true,
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })

    @UseGuards(AuthGard)
    @Roles(UserRole.ADMIN)
    uploadImage(
      @Req() req: Request,
  
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 10485760 }),
            new FileTypeValidator({
              fileType: /image\/(jpg|jpeg|png)$/i,
            }),
          ],
        }),
      )
      file: Express.Multer.File,
    ) {
      return this.uploadService.uploadImage(req, file);
    }
  
    @UseGuards(AuthGard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    deleteImage(@Param('id') id: number) {
      return this.uploadService.deleteImage(id);
    }
  }
  