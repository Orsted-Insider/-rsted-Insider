document.addEventListener('DOMContentLoaded', function() {
    fetch('pdf-files.json')
        .then(response => response.json())
        .then(files => {
            const pdfFiles = files.filter(file => file.name.endsWith('.pdf'));
            pdfFiles.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

            const tableBody = document.querySelector('#pdf-table tbody');
            pdfFiles.forEach(file => {
                const row = document.createElement('tr');
                const fileNameCell = document.createElement('td');
                const lastModifiedCell = document.createElement('td');

                const link = document.createElement('a');
                link.href = `#`;
                link.textContent = file.name;
                link.dataset.file = file.name; // Store file name in a data attribute
                link.classList.add('pdf-link');
                fileNameCell.appendChild(link);

                lastModifiedCell.textContent = new Date(file.lastModified).toLocaleString();

                row.appendChild(fileNameCell);
                row.appendChild(lastModifiedCell);
                tableBody.appendChild(row);
            });

            // Attach click event to all links
            document.querySelectorAll('.pdf-link').forEach(link => {
                link.addEventListener('click', function(event) {
                    event.preventDefault(); // Prevent default link behavior
                    const fileName = this.dataset.file;
                    const iframe = document.getElementById('pdf-viewer');
                    const downloadLink = document.getElementById('download-link');
                    iframe.src = `pdf/${fileName}`;
                    downloadLink.href = `pdf/${fileName}`;
                    downloadLink.textContent = fileName;
                });
            });
        })
        .catch(error => console.error('Error fetching PDF files:', error));
});
