document.getElementById('trainForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const datetime = document.getElementById('datetime').value;
    getTrainConnections(from, to, datetime);
    document.getElementById('from').value = from; // Keep the input values after search
    document.getElementById('to').value = to;
    document.getElementById('datetime').value = datetime;
    toggleFormVisibility(); // Hide the form when search is clicked
});

document.getElementById('toggleFormButton').addEventListener('click', function() {
    toggleFormVisibility(); // Show the form when toggle button is clicked
});

function toggleFormVisibility() {
    const form = document.getElementById('trainForm');
    form.classList.toggle('hidden');
    const toggleButton = document.getElementById('toggleFormButton');
    toggleButton.textContent = form.classList.contains('hidden') ? 'Formular anzeigen' : 'Formular ausblenden';
}

async function getTrainConnections(from, to, datetime) {

    console.log(datetime);
    let params = {};
    if (datetime !== null) {
        let date = datetime.split('T')[0];
        let time = datetime.split('T')[1];
        params = {
            from: from,
            to: to,
            date: date,
            time: time
        };
    } else {
        params = {
            from: from,
            to: to
        };
    }

    params.limit = 10;
    
    console.log(params);

    try {
        const response = await axios.get(`https://transport.opendata.ch/v1/connections`, {
            params: params
        });
        const connections = response.data.connections.slice(0, 5); // Nehmen Sie die ersten vier Verbindungen
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = ''; // Leere den Container vor dem Hinzufügen neuer Ergebnisse

        connections.forEach((connection, index) => {
            const div = document.createElement('div');
            const departureTime = new Date(connection.from.departure).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
            const arrivalTime = new Date(connection.to.arrival).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
        
            // Extract hours and minutes from the duration
            const durationMatch = connection.duration.match(/(\d+)d(\d{2}):(\d{2}):(\d{2})/);
            const days = durationMatch[1];
            const hours = durationMatch[2];
            const minutes = durationMatch[3];
            
            console.log(connection);
        
            // Calculate the total duration in minutes
            const totalMinutes = parseInt(days) * 1440 + parseInt(hours) * 60 + parseInt(minutes);

            const platformInfo = connection.from.platform ? ` ${connection.from.platform}` : ''; // Nur anzeigen, wenn Plattforminformationen verfügbar sind
            console.log(platformInfo);

            const isBus = connection.products.some(product => /^\d+$/.test(product));
            let transportMittel = "";
            if (connection.sections[0].journey) {
                if (connection.sections[0].journey.category == "B" || isBus) {
                    transportMittel = "Bus";
                } else if (connection.sections[0].journey.category == "T") {
                    transportMittel = "Tram";
                } else {
                    transportMittel = "Zug";
                }
            }

            const trainProducts = ["IR 75", "IC 8", "EC 5", "ICE 70", "RE 15", "RB 22", "S7", "TGV 9266", "RJ 63"];
            const isTrainProduct = connection.products.some(product => trainProducts.includes(product));

            let platformOrTrack = "";
            if (transportMittel == "Zug") { // Wenn es sich um einen Zug handelt, wird immer "Gleis" angezeigt
                platformOrTrack = `Gleis: ${connection.from.platform}`; 
            } else {
                // Nur Kante anzeigen, wenn Informationen verfügbar sind
                platformOrTrack = connection.from.platform ? `Kante ${connection.from.platform}` : '';
            }

            let raucherinfo = calculateTransferTimes(connection);

            div.innerHTML = `
            <p class="departure-station">${connection.from.station.name} –<br>${connection.to.station.name}</p>
            <p>Abfahrt: ${departureTime}</p>
            <p>${platformOrTrack}</p>
            <p>Ankunft: ${arrivalTime}</p>
            <p>Dauer: ${totalMinutes} min</p>
            <p>Umsteigen: ${connection.transfers}</p>
            
            ${(Array.isArray(raucherinfo) ? raucherinfo.map(stop => `
                <p
        }`;
            resultsContainer.appendChild(div);
        }) 
