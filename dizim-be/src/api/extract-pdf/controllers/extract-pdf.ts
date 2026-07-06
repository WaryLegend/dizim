import type { Core } from '@strapi/strapi';
import * as http from 'http';
import * as https from 'https';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { Readable } from 'stream';

function downloadFile(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function uploadImageViaService(
  strapiInstance: Core.Strapi,
  imageBuffer: Buffer,
  filename: string
): Promise<string | null> {
  const tmpPath = path.join(os.tmpdir(), filename);
  try {
    fs.writeFileSync(tmpPath, imageBuffer);
    const stat = fs.statSync(tmpPath);

    const uploadedFiles = await strapiInstance.plugin('upload').service('upload').upload({
      data: {},
      files: {
        filepath: tmpPath,        
        originalFilename: filename,
        mimetype: 'image/png',
        size: stat.size,
      },
    });

    if (uploadedFiles?.[0]?.url) {
      const strapiUrl = process.env.STRAPI_URL || 'http://192.168.1.101:1337';
      const url = uploadedFiles[0].url.startsWith('http')
        ? uploadedFiles[0].url
        : `${strapiUrl}${uploadedFiles[0].url}`;
      console.log(`[extract-pdf] Upload success: ${url}`);
      return url;
    }
    return null;
  } catch (err) {
    console.error('[extract-pdf] Upload via service error:', err);
    return null;
  } finally {
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
  }
}

const extractPdfController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async extract(ctx: any) {
    try {
      const { pdf_url } = ctx.request.body as { pdf_url: string };

      if (!pdf_url) {
        return ctx.badRequest('Thiếu pdf_url trong request body');
      }

      const pdfjsLib = await import('pdfjs-dist/build/pdf' as any);
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker' as any);
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

      const pdfBuffer = await downloadFile(pdf_url);
      const pdfData = new Uint8Array(pdfBuffer);
      const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
      const numPages = pdfDoc.numPages;
      console.log(`[extract-pdf] Total pages: ${numPages}`);

      const results: Array<{
        page: number;
        text: string;
        image_urls: string[];
      }> = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);

        // Extract text
        const textContent = await page.getTextContent();
        const pageText = (textContent.items as any[])
          .map((item: any) => item.str)
          .join(' ')
          .trim();

        // Render toàn trang thành ảnh PNG (thay vì extract ảnh nhúng)
        const imageUrls: string[] = [];
        try {
          const { createCanvas } = await import('canvas');
          const viewport = page.getViewport({ scale: 2.0 }); // scale 2x cho nét
          const canvas = createCanvas(viewport.width, viewport.height);
          const ctx2d = canvas.getContext('2d');

          await page.render({
            canvasContext: ctx2d as any,
            viewport,
          }).promise;

          const pngBuffer = canvas.toBuffer('image/png');
          const filename = `pdf_page${pageNum}_${Date.now()}.png`;
          const uploadedUrl = await uploadImageViaService(strapi, pngBuffer, filename);
          if (uploadedUrl) imageUrls.push(uploadedUrl);
        } catch (renderErr) {
          console.warn(`[extract-pdf] Error rendering page ${pageNum}:`, renderErr);
        }

        console.log(`[extract-pdf] Page ${pageNum} done. Images: ${imageUrls.length}`);
        results.push({ page: pageNum, text: pageText, image_urls: imageUrls });
      }

      return ctx.send({ success: true, total_pages: numPages, pages: results });

    } catch (error: any) {
      console.error('Extract PDF error:', error);
      return ctx.internalServerError(`Lỗi xử lý PDF: ${error.message}`);
    }
  },
});

export default extractPdfController;