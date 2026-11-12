document.getElementById('csvFileInput').addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const csvContent = e.target.result;
            const htmlTable = convertCsvToHtml(csvContent);
            document.getElementById('tableContainer').innerHTML = htmlTable;
        };
        reader.readAsText(file);
    }
}

function convertCsvToHtml(csv) {
    const lines = csv.split(/\r?\n/);
    let html = '<table border="1">';

    //Header
    const headers = lines[0].split(',');
    html += '<thread><tr>';
    headers.forEach(header => {
        html += `<th>${header}</th>`;
    });
    html += '</tr></thead>';

    // Body
    html += '<tbody>';
    for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split(',');
        if (cells.length === headers.length) {
            html += '<tr>';
            cells.forEach(cell => {
                html += `<td>${cell}</td>`;
            })
            html += '</tr>';
        }
    }
    html += '</tbody>';
    html += '</table>';
    return html;
}


//FROM: https://dev.to/dataformathub/transform-csv-data-to-html-tables-for-web-display-a-comprehensive-guide-443
/* <script>
        document.getElementById('csvFileInput').addEventListener('change', handleFileSelect, false);

        function handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const csvContent = e.target.result;
                    const htmlTable = convertCsvToHtml(csvContent);
                    document.getElementById('tableContainer').innerHTML = htmlTable;
                };
                reader.readAsText(file);
            }
        }

        function convertCsvToHtml(csv) {
            const lines = csv.split(/\r?\n/);
            let html = '<table border="1">';

            // Header
            const headers = lines[0].split(','); //
            html += '<thead><tr>';
            headers.forEach(header => {
                html += `<th>${header}</th>`;
            });
            html += '</tr></thead>';

            // Body
            html += '<tbody>';
            for (let i = 1; i < lines.length; i++) {
                const cells = lines[i].split(',');
                if (cells.length === headers.length) { // Ensure consistent row structure
                    html += '<tr>';
                    cells.forEach(cell => {
                        html += `<td>${cell}</td>`;
                    });
                    html += '</tr>';
                }
            }
            html += '</tbody>';
            html += '</table>';
            return html;
        }
    </script> */