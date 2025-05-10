import * as path from 'path';
import * as fs from 'fs';
import { Poppler } from 'node-poppler';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_DIR = path.join(__dirname, '../public/pdfs');
const IMAGE_DIR = path.join(__dirname, '../public/images');

if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

// PDFが存在しない画像を削除
async function cleanOrphanImages() {
  const pdfBaseNames = new Set(
    fs.readdirSync(PDF_DIR)
      .filter(f => f.endsWith('.pdf'))
      .map(f => path.basename(f, '.pdf'))
  );
  const imageFiles = fs.readdirSync(IMAGE_DIR).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));
  for (const img of imageFiles) {
    // 例: A-3-10_Nemoto_Yuki.jpg.jpg も考慮
    let base = img;
    base = base.replace(/\.jpg$/i, '');
    base = base.replace(/\.jpeg$/i, '');
    base = base.replace(/\.jpg$/i, '');
    if (!pdfBaseNames.has(base)) {
      fs.unlinkSync(path.join(IMAGE_DIR, img));
      console.log(`Deleted orphan image: ${img}`);
    }
  }
}

async function convertPdfToImage(pdfPath: string) {
  const fileName = path.basename(pdfPath, '.pdf');
  const outputPath = path.join(IMAGE_DIR, `${fileName}.jpg`);
  const poppler = new Poppler();

  const options = {
    firstPageToConvert: 1,
    lastPageToConvert: 1,
    jpegFile: true,
    singleFile: true,
    resolutionXYAxis: 200,
  };

  try {
    await poppler.pdfToCairo(pdfPath, outputPath, options);
    console.log(`Converted ${pdfPath} to ${outputPath}`);
  } catch (err) {
    console.error(`Error converting ${pdfPath}:`, err);
  }
}

async function processAllPdfs() {
  await cleanOrphanImages();
  const files = fs.readdirSync(PDF_DIR).filter(f => f.endsWith('.pdf'));
  for (const file of files) {
    await convertPdfToImage(path.join(PDF_DIR, file));
  }
}

processAllPdfs(); 