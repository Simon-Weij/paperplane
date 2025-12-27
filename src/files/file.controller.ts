/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// Copyright (c) 2025 Simon-Weij
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Controller, Post, UploadedFile, Body } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';

@Controller()
export class FileController {
  @Post('files')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    console.log('Uploaded file:', file.originalname);
    console.log('Password:', body.password);
    return {
      message: 'File uploaded successfully',
      filename: file.originalname as string,
    };
  }
}
