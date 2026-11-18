const url = 'pr-pol.pdf';

const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cloudflare.com';

const container = document.getElementById('pdf-container');
const loading = document.getElementById('loading');

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
    loading.textContent = 'Failed to load PDF. Please use the link below';
    console.error(error);
});
