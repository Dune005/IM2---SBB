document.getElementById('trainForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const datetime = document.getElementById('datetime').value;
    getTrainConnections(from, to, datetime);
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
    from = "chur, sommeraustrasse";
    to = "st.gallen";
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
        
            // Calculate the total duration in minutes
            const totalMinutes = parseInt(days) * 1440 + parseInt(hours) * 60 + parseInt(minutes);

            const platformInfo = connection.from.platform ? ` ${connection.from.platform}` : 'Keine Gleisinformation verfügbar';
            console.log(platformInfo);

            const isBus = connection.products.some(product => /^\d+$/.test(product));
            let transportMittel = "";
            if (connection.sections[0].journey) {
                if (connection.sections[0].journey.category == "B") {
                    transportMittel = "Bus";
                } else if (connection.sections[0].journey.category == "T") {
                    transportMittel = "Tram";
                } else if (!isBus) {
                    transportMittel = "Zug";
                }
            }
            
            let platformOrTrack = "";
            if (isBus || transportMittel == "Tram") {
                platformOrTrack = `Kante ${platformInfo}`;
            } else platformOrTrack = `Gleis: ${platformInfo}`;

            let raucherinfo = calculateTransferTimes(connection);

            div.innerHTML = `
            <p class="departure-station">${connection.from.station.name}<br>${connection.to.station.name}</p>
            <p>Abfahrt: ${departureTime}</p>
            <p>${platformOrTrack}</p>
            <p>Ankunft: ${arrivalTime}</p>
            <p>Dauer: ${totalMinutes} min</p>
            <p>Umsteigen: ${connection.transfers}</p>
            
            ${(Array.isArray(raucherinfo) ? raucherinfo.map(stop => `
                <p class="rauchstopp">Dein Rauchstopp (${stop.raucherzeit}min): ${stop.raucherbahnhof}</p>
                <img class="bild_rauchstopp" src="https://cdn-01.media-brady.com/store/stch/media/catalog/product/d/m/dmne_7961031012_p_std.lang.all.jpg" alt="Rauchstopp Icon">
            `).join('') : '')}
        
            <button id="details-${index}">Details</button>
            <div id="overlay-${index}" class="overlay" style="display:none;">
                <div class="overlay-content">
                    <span class="close" id="close-${index}">&times;</span>
                    <p>Transportmittel: ${connection.products.join(', ')}</p>
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

function calculateTransferTimes(connection) {
    if (!connection.sections || connection.sections.length < 2) {
        console.log('Nicht genug Abschnitte für Umsteigezeiten.');
        return [];
    }

    const transferTimes = [];
    let raucherinfo = [];
    const estimatedWalkingTime = 180; // Geschätzte Fußwegzeit in Sekunden (z.B. 3 Minuten)

    // Überprüfen, ob Buslinien in der Verbindung enthalten sind
    const hasBus = connection.products.some(product => product === "2" || product.startsWith("B"));

    for (let i = 0; i < connection.sections.length - 1; i++) {
        const currentSection = connection.sections[i];
        const nextSection = connection.sections[i + 1];

        if (currentSection.arrival && nextSection.departure) {
            let timeDiff = nextSection.departure.departureTimestamp - currentSection.arrival.arrivalTimestamp;

            // Fußwegzeit nur unter bestimmten Bedingungen hinzufügen
            if (hasBus && (i > 0 || i === connection.sections.length - 2)) { 
                timeDiff += estimatedWalkingTime;
            }

            const minutes = Math.floor(timeDiff / 60);

            transferTimes.push(minutes);

            if (minutes >= 8) {
                raucherinfo.push({
                    raucherzeit: minutes,
                    raucherbahnhof: nextSection.departure.location.name
                });
            }
        }
    }

    console.log('Umsteigezeiten in Minuten:', transferTimes);
    console.log('Raucherinfo:', raucherinfo);
    return raucherinfo;
}

// hier wird die Suchfunktion für die Standortvorschläge implementiert.
document.getElementById('from').addEventListener('input', function(event) {
    updateSuggestions(this.value, 'from-suggestions');
});

document.getElementById('to').addEventListener('input', function(event) {
    updateSuggestions(this.value, 'to-suggestions');
});

async function updateSuggestions(input, suggestionsContainerId) {
    if (input.length < 2) { // Mindestens 2 Buchstaben, bevor Anfragen gesendet werden
        document.getElementById(suggestionsContainerId).innerHTML = '';
        return;
    }
    try {
        const response = await axios.get(`https://transport.opendata.ch/v1/locations?query=${input}`);
        const locations = response.data.stations;
        const suggestionsContainer = document.getElementById(suggestionsContainerId);
        suggestionsContainer.innerHTML = ''; // Leere den Container vor dem Hinzufügen neuer Vorschläge

        locations.forEach(location => {
            const option = document.createElement('div');
            option.innerHTML = location.name;
            option.className = 'suggestion';
            option.onclick = function() {
                // Bestimme, welches Input-Feld aktualisiert werden soll
                if (suggestionsContainerId === 'from-suggestions') {
                    document.getElementById('from').value = location.name;
                } else {
                    document.getElementById('to').value = location.name;
                }
                document.getElementById(suggestionsContainerId).innerHTML = '';
            };
            suggestionsContainer.appendChild(option);
        });
    } catch (error) {
        console.error('Fehler beim Abrufen von Standortvorschlägen:', error);
    }
}

var inputFrom = document.getElementById("from");
hidePopup("popup1");
hidePopup("popup2");

inputFrom.addEventListener("input", function() {
    if (inputFrom.value.trim().length > 1) { // Check if input has some text
        showPopup("popup1");
    } else {
        hidePopup("popup1");
        hidePopup("popup2");
    }
});

var inputTo = document.getElementById("to");

inputTo.addEventListener("input", function() {
    if (inputTo.value.trim().length > 1) { // Check if input has some text
        showPopup("popup2");
    } else {
        hidePopup("popup1");
        hidePopup("popup2");
    }
});

function showPopup(popupId) {
    var popup = document.getElementById(popupId);
    popup.style.display = "block";
    var input = document.getElementById(popupId === "popup1" ? "from" : "to");
    var rect = input.getBoundingClientRect(); // Get the position of the input element relative to the viewport

    popup.style.top = rect.bottom + window.pageYOffset + "px";

    var dropdownMenu = document.getElementById(popupId);
    dropdownMenu.addEventListener("click", function() {
        hidePopup(popupId);
    });
}

function hidePopup(popupId) {
    var popup = document.getElementById(popupId);
    popup.style.display = "none";
}