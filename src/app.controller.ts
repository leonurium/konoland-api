import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
  @Get()
  getRoot(@Res() res: Response) {
    // Serve the landing page HTML
    const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
    
    if (fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath);
    }
    
    // Fallback to inline HTML if file doesn't exist
    return res.send(this.getFallbackHTML());
  }

  private getFallbackHTML(): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Konoha Land API</title>
        </head>
        <body>
          <h1>🌏 Konoha Land API</h1>
          <p>Free Indonesian Administrative Regions API</p>
          <p>Visit <a href="https://github.com/leonurium/konoland-api">GitHub</a> for documentation</p>
        </body>
      </html>
    `;
  }
}
