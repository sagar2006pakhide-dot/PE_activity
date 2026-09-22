import { Request, Response } from 'express';
import { parseDocument } from '../services/documentParser.js';
import { extractTextFromImage } from '../services/ocrService.js';

export async function handleUpload(req: Request, res: Response): Promise<void> {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'No file was uploaded.' });
      return;
    }

    const filename = file.originalname;
    const mimetype = file.mimetype;
    const ext = filename.split('.').pop()?.toLowerCase() || '';

    // Check if it's an image
    if (mimetype.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'bmp'].includes(ext)) {
      const ocrResult = await extractTextFromImage(file.buffer);
      res.json({
        success: true,
        type: 'image',
        filename,
        text: ocrResult.text,
        confidence: ocrResult.confidence,
        message: 'Text successfully extracted from image via OCR.'
      });
      return;
    }

    // Check if it's a document (TXT, PDF, DOCX)
    if (['txt', 'pdf', 'docx', 'doc'].includes(ext) || mimetype.includes('pdf') || mimetype.includes('text') || mimetype.includes('word')) {
      const docResult = await parseDocument(file.buffer, mimetype, filename);
      res.json({
        success: true,
        type: 'document',
        filename,
        text: docResult.text,
        pageCount: docResult.pageCount,
        message: 'Document text successfully parsed.'
      });
      return;
    }

    res.status(400).json({ 
      error: 'Unsupported file format. Please upload TXT, PDF, DOCX, or screenshot images (JPG/PNG).' 
    });
  } catch (error) {
    console.error('Upload controller error:', error);
    res.status(500).json({ 
      error: 'Failed to process the uploaded file. Please try again or paste the text directly.',
      details: error instanceof Error ? error.message : 'Upload parsing error'
    });
  }
}
