document.addEventListener('DOMContentLoaded', function() {
    fetch('pdf-files.json')
        .then(response => response.json())
        .then(files => {
            // Filter and sort PDF files
            const pdfFiles = files.filter(file => file.name.endsWith('.pdf'));
            pdfFiles.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

            // Display the most recent PDF
            const mostRecent = pdfFiles[0];
            if (mostRecent) {
                const iframe = document.getElementById('pdf-viewer');
                const downloadLink = document.getElementById('download-link');
                iframe.src = `pdf/${mostRecent.name}#toolbar=0`;
                downloadLink.href = `pdf/${mostRecent.name}`;
                downloadLink.textContent = mostRecent.name;
            }
        })
        .catch(error => console.error('Error fetching PDF files:', error));
});
