document.addEventListener('DOMContentLoaded', function() {
    const pdfFolder = 'pdf/';
    const repo = 'Orsted-Insider/oersted-Insider';

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
            document.getElementById('recent-pdf').src = recentPdfURL;
            document.getElementById('recent-pdf-link').href = recentPdfURL;
            document.getElementById('recent-pdf-link').textContent = recentFile.name;
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

    fetchPDFs().then(files => {
        if (window.location.pathname.includes('index.html')) {
            setRecentArticle(files);
        }
        generateArticleList(files);
    });
});