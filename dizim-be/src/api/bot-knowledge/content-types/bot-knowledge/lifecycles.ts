import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import * as pdfjs from 'pdfjs-dist';

// Cấu hình không sử dụng worker ngoài của pdfjs để chạy mượt mà trong Node.js
(pdfjs as any).GlobalWorkerOptions.workerSrc = false;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function processFileAndVectorEmbedding(id: number) {
  if (!id) return;

  // Đẩy hoàn toàn vào Event Loop chạy sau 3 -> 5 giây để tách biệt với Transaction tạo của Strapi Admin
  setTimeout(async () => {
    try {
      strapi.log.info(`[Auto-RAG Lifecycles] Bắt đầu bóc tách dữ liệu cho ID: ${id}`);
      const dbClient = strapi.db.connection;

      const [rows] = await dbClient.raw(`
        SELECT f.url, f.name, f.ext
        FROM files f
        JOIN files_related_mph links ON f.id = links.file_id
        WHERE links.related_id = ? 
          AND links.related_type = 'api::bot-knowledge.bot-knowledge' 
          AND links.field = 'source_file'
        LIMIT 1
      `, [id]);

      const fileInfo = rows && rows.length > 0 ? rows[0] : null;

      if (!fileInfo) {
        strapi.log.warn(`[Auto-RAG Lifecycles] Không tìm thấy liên kết file cho ID ${id}. Hãy chắc chắn đã chọn file trước khi Lưu.`);
        return;
      }

      // Xác định đường dẫn file vật lý
      const publicDir = strapi.dirs.static.public; 
      const absoluteFilePath = path.join(publicDir, fileInfo.url);

      if (!fs.existsSync(absoluteFilePath)) {
        strapi.log.error(`[Auto-RAG Lifecycles] File không tồn tại tại: ${absoluteFilePath}`);
        return;
      }

      let extractedText = '';
      const fileExt = fileInfo.ext ? fileInfo.ext.toLowerCase() : path.extname(fileInfo.url).toLowerCase();

      if (fileExt === '.pdf') {
        strapi.log.info(`[Auto-RAG Lifecycles] Đang xử lý file PDF: ${fileInfo.name}`);
        const fileBuffer = fs.readFileSync(absoluteFilePath);
        const uint8Array = new Uint8Array(fileBuffer);
        
        const loadingTask = pdfjs.getDocument({ data: uint8Array });
        const pdfDocument = await loadingTask.promise;
        
        let fullText = '';
        for (let i = 1; i <= pdfDocument.numPages; i++) {
          const page = await pdfDocument.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n';
        }
        extractedText = fullText;
      } else if (fileExt === '.txt') {
        strapi.log.info(`[Auto-RAG Lifecycles] Đang đọc file TXT: ${fileInfo.name}`);
        extractedText = fs.readFileSync(absoluteFilePath, 'utf-8');
      } else {
        strapi.log.warn(`[Auto-RAG Lifecycles] Định dạng file ${fileExt} hệ thống chưa hỗ trợ.`);
        return;
      }

      extractedText = extractedText.trim();
      if (!extractedText) {
        strapi.log.warn(`[Auto-RAG Lifecycles] Nội dung file trống.`);
        return;
      }

      // Gọi API Gemini sinh Vector Embedding (Model: gemini-embedding-001)
      strapi.log.info(`[Auto-RAG Lifecycles] Đang gọi Gemini API tạo Embedding...`);
      const embeddingResult = await ai.models.embedContent({
        model: 'gemini-embedding-001', 
        contents: extractedText,
      });

      const vectorValues = embeddingResult.embeddings[0].values;
      const jsonVector = JSON.stringify(vectorValues);

      // Cập nhật bằng SQL thuần bỏ qua ORM để chặn đứng hoàn toàn vòng lặp vô hạn (Infinite Loop)
      await dbClient.raw(`
        UPDATE bot_knowledges 
        SET content = ?, embedding = ? 
        WHERE id = ?
      `, [extractedText, jsonVector, id]);

      strapi.log.info(`[Auto-RAG Lifecycles] Thành công! Đã cập nhật content & embedding cho bản ghi ID: ${id}`);

    } catch (error) {
      strapi.log.error(`[Auto-RAG Lifecycles] Lỗi xử lý tài liệu tại ID ${id}:`, error);
    }
  }, 4000); 
}

export default {
  // Chạy khi bấm tạo mới dữ liệu
  async afterCreate(event) {
    const { result } = event;
    if (result && result.id) {
      processFileAndVectorEmbedding(result.id); 
    }
  },

  // Chạy khi bấm chỉnh sửa/update dữ liệu
  async afterUpdate(event) {
    const { result, params } = event;
    const updatedFields = params?.data;
    
    // Chỉ kích hoạt luồng AI khi trường file tài liệu có sự thay đổi thực sự
    if (!updatedFields || !updatedFields.source_file) return;

    if (result && result.id) {
      processFileAndVectorEmbedding(result.id); 
    }
  }
};