import { getDocument, GlobalWorkerOptions } from './pdfjs-4.6.82-dist/build/pdf.mjs';

document.addEventListener('DOMContentLoaded', function() {
    const pdfFolder = 'pdf/';
    const repo = 'Orsted-Insider/oersted-Insider';

    GlobalWorkerOptions.workerSrc = './pdfjs-4.6.82-dist/build/pdf.worker.mjs';

    function fetchPDFs() {
        return fetch(`https://api.github.com/repos/${repo}/contents/${pdfFolder}`)
            .then(response => response.json())
            .then(data => data.filter(file => file.name.endsWith('.pdf')))
            .then(files => files.map(file => ({
                name: file.name,
                path: file.download_url,
                date: new Date(file.name.split('-').slice(0, 3).join('-')) // Extract date from filename
            })))
            .then(files => files.sort((a, b) => b.date - a.date)); // Sort files by date, newest first
    }

    function setRecentArticle(files) {
        const recentFile = files[0]; // Most recent file
        if (recentFile) {
            const recentPdfURL = recentFile.path;
            loadPDF(recentPdfURL);
        }
    }

    function generateArticleList(files) {
        const list = document.getElementById('pdf-list');
        files.forEach(file => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = file.path;
            link.textContent = file.name;
            link.target = '_blank';
            listItem.appendChild(link);
            list.appendChild(listItem);
        });
    }

    function loadPDF(url) {
        const loadingTask = getDocument(url);
        loadingTask.promise.then(pdf => {
            const viewer = document.getElementById('pdf-viewer');
            viewer.innerHTML = '';

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                pdf.getPage(pageNum).then(page => {
                    const scale = 1.5;
                    const viewport = page.getViewport({ scale });

                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    viewer.appendChild(canvas);

                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    page.render(renderContext);
                });
            }
        });
    }

    fetchPDFs().then(files => {
        if (window.location.pathname.includes('index.html')) {
            setRecentArticle(files);
        }
        generateArticleList(files);
    });
});