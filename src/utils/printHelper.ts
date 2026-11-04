/**
 * ============================================================================
 * 🖨️ ระบบช่วยพิมพ์เอกสารและใบงาน (Reliable Print Helper)
 * ============================================================================
 * แก้ปัญหาการสั่งพิมพ์แล้วหน้าว่าง หรือถูกตัดขอบจาก Modal / overflow-hidden
 * โดยสร้าง Iframe สำหรับพิมพ์โดยเฉพาะพร้อมคัดลอกสไตล์ทั้งหมดของระบบ
 */

export function printElementById(
  elementId: string,
  documentTitle?: string,
  orientation: 'portrait' | 'landscape' = 'portrait'
): void {
  const sourceElement = document.getElementById(elementId);
  if (!sourceElement) {
    window.print();
    return;
  }

  // ลบ iframe พิมพ์เก่าถ้ามีค้างอยู่
  const existingIframe = document.getElementById('luno-print-iframe');
  if (existingIframe && existingIframe.parentNode) {
    existingIframe.parentNode.removeChild(existingIframe);
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'luno-print-iframe';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc || !iframe.contentWindow) {
    window.print();
    return;
  }

  // รวบรวม <style> และ <link rel="stylesheet"> ทั้งหมดจากหน้าหลัก
  const styleNodes = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
  const stylesHtml = styleNodes.map(node => node.outerHTML).join('\n');

  const printTitle = documentTitle || document.title || 'LUNO_Document';
  const pageMargin = orientation === 'landscape' ? '8mm 10mm' : '10mm 12mm';

  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html lang="th">
      <head>
        <meta charset="UTF-8" />
        <title>${printTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        ${stylesHtml}
        <style>
          @page {
            size: A4 ${orientation};
            margin: ${pageMargin};
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #0f172a !important;
            font-family: 'Prompt', 'Plus Jakarta Sans', sans-serif !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
          body * {
            visibility: visible !important;
          }
          #printable-artifact {
            position: static !important;
            width: 100% !important;
            max-width: 186mm !important;
            min-height: 273mm !important;
            margin: 0 auto !important;
            padding: 6mm 8mm !important;
            box-sizing: border-box !important;
            box-shadow: none !important;
            border: none !important;
            overflow: visible !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
          #certificate-printable {
            position: relative !important;
            width: 277mm !important;
            max-width: 100% !important;
            height: 192mm !important;
            min-height: 192mm !important;
            max-height: 192mm !important;
            margin: 0 auto !important;
            padding: 12mm 16mm !important;
            box-sizing: border-box !important;
            box-shadow: none !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            page-break-after: avoid !important;
            break-inside: avoid !important;
          }
          .print-avoid-break, .rounded-2xl, .rounded-xl, .page-break-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        </style>
      </head>
      <body>
        ${sourceElement.outerHTML}
      </body>
    </html>
  `);
  iframeDoc.close();

  // รอให้ฟอนต์และ CSS โหลดเสร็จก่อนสั่งพิมพ์
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.print();
    }
  }, 350);
}

