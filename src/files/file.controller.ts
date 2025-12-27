/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// Copyright (c) 2025 Simon-Weij
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import {
  Controller,
  Post,
  UploadedFile,
  Body,
  Req,
  Get,
  Res,
  Param,
} from '@nestjs/common';
import { join } from 'path';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import type { Request, Response } from 'express';
import { tmpdir } from 'os';
import * as fs from 'fs';

@Controller('files')
export class FileController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    const tmpDir = tmpdir();
    const rand =
      Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    const location = join(tmpDir, rand, file.originalname as string);
    console.log('Uploaded file:', file.originalname);
    console.log('Password:', body.password);

    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;

    console.log('Base URL:', baseUrl);

    fs.mkdirSync(join(tmpDir, rand), { recursive: true });
    if (file.buffer) {
      fs.writeFileSync(location, file.buffer as Buffer);
    } else if (file.path) {
      fs.copyFileSync(file.path as string, location);
    }

    return {
      message: 'File uploaded successfully',
      filename: file.originalname as string,
      baseUrl: `${baseUrl}/api/files/${rand}`,
    };
  }

  @Get(':id')
  getFile(@Param('id') id: string, @Res() res: Response) {
    const dir = join(tmpdir(), id);
    if (!fs.existsSync(dir)) {
      return res.status(404).send('File not found');
    }
    const files = fs.readdirSync(dir);
    if (files.length === 0) {
      return res.status(404).send('File not found');
    }
    const filepath = join(dir, files[0]);
    res.sendFile(filepath);
  }
}
