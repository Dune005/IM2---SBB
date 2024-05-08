

document.getElementById('trainForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const datetime = document.getElementById('datetime').value;
    getTrainConnections(from, to, datetime);
});

// document.getElementById('button').addEventListener('click', function() {
//     const from = document.getElementById('from').value;
//     const to = document.getElementById('to').value;
//     const datetime = document.getElementById('datetime').value;

//     getTrainConnections(from, to, datetime);
// });



async function getTrainConnections(from, to, datetime) {
    //muss gelöscht werden damit die Abfrage funktioniert
    from = "wittenbach zentrum";
    to = "Bern";

    // get date from datetime
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
    
    console.log(params);

    try {
        const response = await axios.get(`https://transport.opendata.ch/v1/connections`, {
            params: params
        });
        const connections = response.data.connections.slice(0, 1); // Nehmen Sie die ersten vier Verbindungen
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = ''; // Leere den Container vor dem Hinzufügen neuer Ergebnisse

        connections.forEach((connection, index) => {
            const div = document.createElement('div');
            const departureTime = new Date(connection.from.departure).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
            const arrivalTime = new Date(connection.to.arrival).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
        
            // Extrahiere Stunden und Minuten aus der Dauer
            const durationMatch = connection.duration.match(/(\d+)d(\d{2}):(\d{2}):(\d{2})/);
            const days = durationMatch[1];
            const hours = durationMatch[2];
            const minutes = durationMatch[3];
        
            // Berechne die gesamte Dauer in Minuten
            const totalMinutes = parseInt(days) * 1440 + parseInt(hours) * 60 + parseInt(minutes);

            const platformInfo = connection.from.platform ? ` ${connection.from.platform}` : 'Keine Gleisinformation verfügbar';
            console.log(platformInfo);

           
            console.log(connection.sections[0].journey.category);
            const isBus = connection.products.some(product => /^\d+$/.test(product)); // Annahme: Busse werden nur mit Nummern angegeben

            let transportMittel = "";
            if (connection.sections[0].journey.category == "B") {
                transportMittel = "Bus";
            } else if (connection.sections[0].journey.category == "T") {
                transportMittel = "Tram";
            } else if (!isBus) {
                transportMittel = "Zug";
            }

            console.log(transportMittel);
            
            let platformOrTrack = "";
            if (isBus || transportMittel == "Tram") {
                platformOrTrack = `Kante ${platformInfo}`;
            } else platformOrTrack = `Gleis: ${platformInfo}`;

            
            console.log(connection);




            // const transportDetails = connection.products.map(product => {
            //     // Einzelne Produktprüfung: Ist es nur eine Zahl?
            //     return /^\d+$/.test(product) ? `Bus ${product}` : product;
            // }).join(', ');






        
            div.innerHTML = `
                <p>${connection.from.station.name} - ${connection.to.station.name}</p>
                <p>Abfahrt: ${departureTime}</p>
                <p> ${platformOrTrack}</p>
                <p>Ankunft: ${arrivalTime}</p>
                <p>Dauer: ${totalMinutes} min</p>
                <p>Umsteigen: ${connection.transfers}</p>
                <button id="details-${index}">Details</button>
                <div id="overlay-${index}" class="overlay" style="display:none;">
                    <div class="overlay-content">
                        <span class="close" id="close-${index}">&times;</span>
                        <p><p>Transportmittel: ${connection.products.join(', ')}</p>
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








// hier wird die Suchfunktion für die Standortvorschläge implementiert.
document.getElementById('from').addEventListener('input', function(event) {
    updateSuggestions(this.value, 'from-suggestions');
});

document.getElementById('to').addEventListener('input', function(event) {
    updateSuggestions(this.value, 'to-suggestions');
});

// Funktion zur Aktualisierung der Vorschläge und zum Setzen des ausgewählten Wertes
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



// Get the input element
var input = document.getElementById("from");

// Add event listener for input event
input.addEventListener("input", function() {
  if (input.value.trim().length > 0) { // Check if input has some text
    showPopup();
  } else {
    hidePopup();
  }
});

function showPopup() {
  var popup = document.querySelector(".popup");
  popup.style.display = "block";
}

function hidePopup() {
  var popup = document.querySelector(".popup");
  popup.style.display = "none";
}


// async function getTrainConnections(from, to) {
//     try {
//         const response = await axios.get(`https://transport.opendata.ch/v1/connections`, {
//             params: {
//                 from: from,
//                 to: to
//             }
//         });
//         const connections = response.data.connections.slice(0, 4); // Nehmen Sie die ersten vier Verbindungen
//         const resultsContainer = document.getElementById('results');
//         resultsContainer.innerHTML = ''; // Leere den Container vor dem Hinzufügen neuer Ergebnisse

//         connections.forEach((connection, index) => {
//             const div = document.createElement('div');
//             const departureTime = new Date(connection.from.departure).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
//             const arrivalTime = new Date(connection.to.arrival).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
        
//             // Extrahiere Stunden und Minuten aus der Dauer
//             const durationMatch = connection.duration.match(/(\d+)d(\d{2}):(\d{2}):(\d{2})/);
//             const days = durationMatch[1];
//             const hours = durationMatch[2];
//             const minutes = durationMatch[3];
        
//             // Berechne die gesamte Dauer in Minuten
//             const totalMinutes = parseInt(days) * 1440 + parseInt(hours) * 60 + parseInt(minutes);

//             const platformInfo = connection.from.platform ? ` ${connection.from.platform}` : 'Keine Gleisinformation verfügbar';
//             console.log(platformInfo);
//             const isBus = connection.products.some(product => /^\d+$/.test(product)); // Annahme: Busse werden nur mit Nummern angegeben
//             const platformOrTrack = isBus ? `Kante ${platformInfo}` : `Gleis: ${platformInfo}`;
//             const transportDetails = connection.products.map(product => {
//                 // Einzelne Produktprüfung: Ist es nur eine Zahl?
//                 return /^\d+$/.test(product) ? `Bus ${product}` : product;
//             }).join(', ');






        
//             div.innerHTML = `
//                 <p>Abfahrt: ${departureTime}</p>
//                 <p> ${platformOrTrack}</p>
//                 <p>Ankunft: ${arrivalTime}</p>
//                 <p>Dauer: ${totalMinutes} min</p>
//                 <p>Umsteigen: ${connection.transfers}</p>
//                 <p>Transportmittel: ${connection.products.join(', ')}</p>
//                 <button id="details-${index}">Details</button>
//                 <div id="overlay-${index}" class="overlay" style="display:none;">
//                     <div class="overlay-content">
//                         <span class="close" id="close-${index}">&times;</span>
//                         <p>Genauer Abfahrtsort: ${connection.from.station.name}</p>
//                     </div>
//                 </div>
//             `;
//             div.classList.add('connection');
//             resultsContainer.appendChild(div);
        
//             document.getElementById(`details-${index}`).addEventListener('click', function() {
//                 document.getElementById(`overlay-${index}`).style.display = 'block';
//             });
//             document.getElementById(`close-${index}`).addEventListener('click', function() {
//                 document.getElementById(`overlay-${index}`).style.display = 'none';
//             });

//             document.getElementById('trainForm').addEventListener('submit', function(event) {
//                 event.preventDefault();
//                 submitDateTime();
//             });
//         });

        
//     } catch (error) {
//         console.error('Fehler beim Abrufen der Zugdaten:', error);
//     }
// }




            // // hier wird der Eingabewert für das Datum und die Uhrzeit abgerufen und an die getTrainConnections-Funktion übergeben.
            // function submitDateTime() {
            //     // Holen Sie den Wert des datetime-Inputs
            //     const datetime = document.getElementById('datetime').value;
            
            //     // Holen Sie die Werte der from und to Inputs
            //     const from = document.getElementById('from').value;
            //     const to = document.getElementById('to').value;
            
            //     // Rufen Sie die getTrainConnections-Funktion mit den geholten Werten auf
            //     getTrainConnections(from, to, datetime);
            // }
            
            // function getTrainConnections(from, to, datetime) {
            //     // Ihr Code zum Abrufen der Zugverbindungen hier
            //     // Verwenden Sie den datetime-Wert in Ihrer API-Anfrage
            // }