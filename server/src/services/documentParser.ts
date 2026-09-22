import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export async function parseDocument(
  fileBuffer: Buffer, 
  mimetype: string, 
  filename: string
): Promise<{ text: string; pageCount?: number }> {
  try {
    const ext = filename.split('.').pop()?.toLowerCase();

    if (ext === 'txt' || mimetype.includes('text/plain')) {
      return { text: fileBuffer.toString('utf-8') };
    }

    if (ext === 'pdf' || mimetype.includes('pdf')) {
      const data = await pdf(fileBuffer);
      return {
        text: data.text.trim(),
        pageCount: data.numpages
      };
    }

    if (ext === 'docx' || ext === 'doc' || mimetype.includes('word')) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return { text: result.value.trim() };
    }

    // Default string conversion
    return { text: fileBuffer.toString('utf-8') };
  } catch (err) {
    console.error('Document parsing error:', err);
    throw new Error('Failed to parse uploaded document. Please ensure it is a valid TXT, PDF, or DOCX file.');
  }
}
