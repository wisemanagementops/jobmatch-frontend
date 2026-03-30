/**
 * PDF Generation Utility
 * Converts HTML resume templates to downloadable PDFs using html2canvas + jsPDF
 */

export async function generatePDF(elementId, filename = 'resume') {
  try {
    // Dynamically import libraries
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Resume element not found');
    }

    // Wait for fonts and styles to load
    await document.fonts.ready;

    // Save original styles — the preview container applies scale(0.75) which
    // distorts the capture.  Temporarily reset to full size for an accurate snapshot.
    const origTransform = element.style.transform;
    const origTransformOrigin = element.style.transformOrigin;
    const origMarginBottom = element.style.marginBottom;

    element.style.transform = 'none';
    element.style.transformOrigin = 'top left';
    element.style.marginBottom = '0';

    // Small delay to let the browser re-layout at full size
    await new Promise(resolve => setTimeout(resolve, 150));

    // Create canvas from HTML with optimized settings
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    // Restore original styles immediately
    element.style.transform = origTransform;
    element.style.transformOrigin = origTransformOrigin;
    element.style.marginBottom = origMarginBottom;

    // US Letter dimensions in mm
    const letterWidth = 215.9;  // 8.5 inches
    const letterHeight = 279.4; // 11 inches

    // Create PDF with US Letter size
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter'
    });

    // Convert canvas to image
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Calculate the image height in mm when scaled to letter width
    const actualImgHeight = (canvas.height * letterWidth) / canvas.width;

    if (actualImgHeight <= letterHeight) {
      // Content fits on one page — just add it
      pdf.addImage(imgData, 'JPEG', 0, 0, letterWidth, actualImgHeight);
    } else if (actualImgHeight <= letterHeight * 2) {
      // Content fits on exactly two pages — split cleanly
      pdf.addImage(imgData, 'JPEG', 0, 0, letterWidth, actualImgHeight);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, -letterHeight, letterWidth, actualImgHeight);
    } else {
      // Content is too long — scale it down to fit on one page
      const scale = letterHeight / actualImgHeight;
      const scaledWidth = letterWidth * scale;
      const xOffset = (letterWidth - scaledWidth) / 2;
      pdf.addImage(imgData, 'JPEG', xOffset, 0, scaledWidth, letterHeight);
    }

    // Download the PDF
    pdf.save(`${filename}.pdf`);

    return true;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
}

/**
 * Print resume (opens print dialog)
 */
export function printResume(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Resume</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            body { 
              margin: 0; 
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact; 
            }
            @page { 
              margin: 0.5in; 
              size: letter; 
            }
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
        <script>
          setTimeout(() => { 
            window.print(); 
          }, 500);
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

export default generatePDF;
