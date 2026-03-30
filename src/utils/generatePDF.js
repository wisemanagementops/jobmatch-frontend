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
    
    // Small delay to ensure everything is rendered
    await new Promise(resolve => setTimeout(resolve, 100));

    // Create canvas from HTML with optimized settings
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // Calculate dimensions for US Letter size (8.5 x 11 inches)
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // For US Letter
    const letterWidth = 215.9; // 8.5 inches
    const letterHeight = 279.4; // 11 inches

    // Create PDF with US Letter size
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter'
    });

    // Convert canvas to image
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate actual image height in mm for letter size
    const actualImgHeight = (canvas.height * letterWidth) / canvas.width;
    
    // Add image to PDF
    let heightLeft = actualImgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, letterWidth, actualImgHeight);
    heightLeft -= letterHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - actualImgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, letterWidth, actualImgHeight);
      heightLeft -= letterHeight;
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
