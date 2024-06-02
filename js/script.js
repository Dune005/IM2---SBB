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
    // from = "st. gallen";
    // to = "chur, city west";
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
                platformOrTrack = connection.from.platform ? `Kante ${connection.from.platform}` : '';
            }

            let raucherinfo = calculateTransferTimes(connection);

            div.innerHTML = `
            <p class="departure-station">${connection.from.station.name} – <br> ${connection.to.station.name}</p>
            <p>Abfahrt: ${departureTime} Uhr</p>
            <p>${platformOrTrack}</p>
            <p>Ankunft: ${arrivalTime} Uhr</p>
            <p>Dauer: ${totalMinutes} min</p>
            <p>Umsteigen: ${connection.transfers}</p>
            <p>Transportmittel: ${connection.products.join(', ')}</p>
            
            ${(Array.isArray(raucherinfo) ? raucherinfo.map((stop, idx) => `
                <p class="rauchstopp" id="rauchstopp-${index}-${idx}">Dein Rauchstopp (${stop.raucherzeit}min): ${stop.raucherbahnhof}</p>
                <div id="overlay-${index}-${idx}" class="overlay" style="display:none;">
                    <div class="overlay-content">
                        <span class="close" id="close-${index}-${idx}">×</span>
                        <p>Transportmittel: ${connection.products.join(', ')}</p>
                    </div>
                </div>
                <img class="bild_rauchstopp" src="https://img.freepik.com/vektoren-kostenlos/raucherbereich-gruener-kreis-zeichen_78370-1286.jpg?size=338&ext=jpg&ga=GA1.1.44546679.1716768000&semt=ais_user" alt="Rauchstopp Icon">
            `).join('') : '')}
        
        `;
            div.classList.add('connection');
            resultsContainer.appendChild(div);

            // Check if there is no "rauchstopp" button and add "KEIN RAUCHSTOPP!" div if necessary
            if (!div.querySelector('.rauchstopp')) {
                const noRauchstoppDiv = document.createElement('div');
                noRauchstoppDiv.textContent = 'KEIN RAUCHSTOPP!';
                noRauchstoppDiv.classList.add('no-rauchstopp');
                div.appendChild(noRauchstoppDiv);
            }

            // Neue Bildüberprüfung und Hinzufügung
            const rauchstoppBilder = div.querySelectorAll('.bild_rauchstopp');
            if (rauchstoppBilder.length === 0) {
                const nichtrauchenBild = document.createElement('img');
                nichtrauchenBild.src = 'https://www.safetymarking.ch/images/280/38A6005_Y_01/verbotsschild-rauchen-verboten.jpg';
                nichtrauchenBild.alt = 'nichtrauchen Bild';
                nichtrauchenBild.classList.add('nichtrauchen-bild'); // Fügen Sie die spezifische Klasse hinzu
                div.appendChild(nichtrauchenBild);
            }

            /*raucherinfo.forEach((stop, idx) => {
                document.getElementById(`rauchstopp-${index}-${idx}`).addEventListener('click', function() {
                    document.getElementById(`overlay-${index}-${idx}`).style.display = 'block';
                });
                document.getElementById(`close-${index}-${idx}`).addEventListener('click', function() {
                    document.getElementById(`overlay-${index}-${idx}`).style.display = 'none';
                });
            });*/
            
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

    const hasBus = connection.products.some(product => product === "2" || product.startsWith("B"));

    for (let i = 0; i < connection.sections.length - 1; i++) {
        const currentSection = connection.sections[i];
        const nextSection = connection.sections[i + 1];

        if (currentSection.arrival && nextSection.departure) {
            let timeDiff = nextSection.departure.departureTimestamp - currentSection.arrival.arrivalTimestamp;

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

document.getElementById('from').addEventListener('input', function(event) {
    updateSuggestions(this.value, 'from-suggestions');
});

document.getElementById('to').addEventListener('input', function(event) {
    updateSuggestions(this.value, 'to-suggestions');
});

async function updateSuggestions(input, suggestionsContainerId) {
    if (input.length < 2) {
        document.getElementById(suggestionsContainerId).innerHTML = '';
        return;
    }
    try {
        const response = await axios.get(`https://transport.opendata.ch/v1/locations?query=${input}`);
        const locations = response.data.stations;
        const suggestionsContainer = document.getElementById(suggestionsContainerId);
        suggestionsContainer.innerHTML = '';

        locations.forEach(location => {
            const option = document.createElement('div');
            option.innerHTML = location.name;
            option.className = 'suggestion';
            option.onclick = function() {
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
    if (inputFrom.value.trim().length > 1) {
        showPopup("popup1");
    } else {
        hidePopup("popup1");
        hidePopup("popup2");
    }
});

var inputTo = document.getElementById("to");

inputTo.addEventListener("input", function() {
    if (inputTo.value.trim().length > 1) {
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
    var rect = input.getBoundingClientRect();

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

document.addEventListener('DOMContentLoaded', function () {
    const h2Element = document.getElementById('hoverText');

    // Erstellen und Stylen des alternativen Textes
    const altText = document.createElement('div');
    altText.classList.add('alt-text');
    altText.textContent = 'Plane deine Reise mit genügend Zeit für Rauchpausen. Keine unnötigen Entzugserscheinungen mehr! Endlich stressfreie Reisen – mit dem Raucher-Reiseplaner kannst du deine Routenplanung so gestalten, dass du bei jedem Zwischenhalt genügend Zeit zum Entspannen bei einer Zigarette hast.';

    // Alternativtext zum h2-Element hinzufügen
    h2Element.appendChild(altText);

    // Event-Listener für Hover-Effekt hinzufügen
    h2Element.addEventListener('mouseenter', function () {
        altText.style.display = 'block';
    });

    h2Element.addEventListener('mouseleave', function () {
        altText.style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded2', function () {
    const h2Element2 = document.getElementById('hoverText2');

    // Erstellen und Stylen des alternativen Textes
    const altText2 = document.createElement('div');
    altText2.classList.add('alt-text2');
    altText2.textContent = 'Kontaktiere uns über das untenstehende Formular.';
    altText2.style.display = 'none'; // Sicherstellen, dass es anfangs nicht sichtbar ist

    // Alternativtext zum h2-Element hinzufügen
    h2Element2.appendChild(altText2);

    // Event-Listener für Hover-Effekt hinzufügen
    h2Element2.addEventListener('mouseenter', function () {
        altText2.style.display = 'block';
    });

    h2Element2.addEventListener('mouseleave', function () {
        altText2.style.display = 'none';
    });
});