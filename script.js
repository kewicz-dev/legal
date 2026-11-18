
window.addEventListener('DOMContentLoaded', function() {
    const url = 'pr-pol.pdf';
    const container = document.getElementById('pdf-container');
    const loading = document.getElementById('loading');

    const pdfjsLib = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
    if (!pdfjsLib) {
        loading.textContent = 'Error: PDF.js failed to load from CDN.';
        return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

    pdfjsLib.getDocument(url).promise.then(async function(pdf) {
        loading.style.display = 'none';

        const containerWidth = container.clientWidth;
        const pixelRatio = window.devicePixelRatio || 1;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            
            const unscaledViewport = page.getViewport({ scale: 1.0 });
            const fitScale = (containerWidth / unscaledViewport.width) * pixelRatio;
            const viewport = page.getViewport({ scale: fitScale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            canvas.style.width = containerWidth + 'px';
            canvas.style.height = (viewport.height / pixelRatio) + 'px';

            container.appendChild(canvas);

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;
        }
    }).catch(function(error) {
        loading.textContent = 'Failed to load PDF: ' + error.message;
        
        const bar = document.querySelector('.download-bar');
        if (bar) {
            bar.style.setProperty('display', 'block', 'important');
        }
        console.error(error);
    });
});

