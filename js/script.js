document.getElementById('trainForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    getTrainConnections(from, to);
});

async function getTrainConnections(from, to) {
    try {
        const response = await axios.get(`https://transport.opendata.ch/v1/connections`, {
            params: {
                from: from,
                to: to
            }
        });
        const connections = response.data.connections.slice(0, 4); // Nehmen Sie die ersten vier Verbindungen
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = ''; // Leere den Container vor dem Hinzufügen neuer Ergebnisse

        connections.forEach((connection, index) => {
            const div = document.createElement('div');
            const departureTime = new Date(connection.from.departure).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
            const arrivalTime = new Date(connection.to.arrival).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
            const duration = connection.duration.substring(3).replace('d', 'Tage ');

            const transportDetails = connection.products.map(product => {
                // Einzelne Produktprüfung: Ist es nur eine Zahl?
                return /^\d+$/.test(product) ? `Bus ${product}` : product;
            }).join(', ');

            div.innerHTML = `
                <p>Abfahrt: ${departureTime}</p>
                <p>Ankunft: ${arrivalTime}</p>
                <p>Dauer: ${duration}</p>
                <p>Umsteigen: ${connection.transfers}</p>
                <p>Transportmittel: ${transportDetails}</p>
                <button id="details-${index}">Details</button>
                <div id="overlay-${index}" class="overlay" style="display:none;">
                    <div class="overlay-content">
                        <span class="close" id="close-${index}">&times;</span>
                        <p>Genauer Abfahrtsort: ${connection.from.station.name}</p>
                    </div>
                </div>
            `;
            div.classList.add('connection');
            resultsContainer.appendChild(div);

            document.getElementById(`details-${index}`).addEventListener('click', function() {
                document.getElementById(`overlay-${index}`).style.display = 'block';
            });
            document.getElementById(`close-${index}`).addEventListener('click', function() {
                document.getElementById(`overlay-${index}`).style.display = 'none';
            });
        });
    } catch (error) {
        console.error('Fehler beim Abrufen der Zugdaten:', error);
    }
}
