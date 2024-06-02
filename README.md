# Der Reiseplaner für Raucher
"Interaktive Medien II"
Klasse MMP23c2
Fachhochschule Graubünden
02. Juni 2024


Willkommen im Repository von "Der Reiseplaner für Raucher"
Wir sind ein Team von drei begeisterten Entwicklern, Aaron Täschler, Claudio Riz und Simon Kuhn, und haben "Der Reiseplaner für Raucher" geschaffen, um dir die Reiseplanung zu vereinfachen.

## Features

Mit unserer Website kannst du:

- **Schnell und einfach Verbindungen zwischen beliebigen Schweizer Bahnhöfen und Haltestellen finden.** Gib einfach deinen Start- und Zielort ein, und wir zeigen dir alle verfügbaren Verbindungen.
- **Detaillierte Informationen zu den Verbindungen einsehen.** Du siehst die Abfahrts- und Ankunftszeiten, die Dauer der Reise, die Anzahl der Umstiege, die benutzten Transportmittel und sogar die Bahnsteignummer.
- **Raucherpausen optimal planen.** Unser System berechnet die Zeit, die du an jedem Zwischenhalt hast, und zeigt dir an, wo du genug Zeit für eine Rauchpause hast!

Bei uns geht es um mehr als nur die reine Reiseplanung. Wir zielen darauf ab, den Rauchern das Leben etwas zu erleichtern. Als Raucher ist man oft bei längeren Reisen darauf angewiesen, bei den Zwischenstopps kurz eine rauchen zu können.

Oftmals macht man sich vor oder während der Reise Gedanken, ob man wohl beim nächsten Zwischenhalt rauchen kann oder nicht. Unsere App nimmt dem User diese Arbeit ab, indem er auf den ersten Blick sieht, ob seine Reise eine Raucherpause zulässt, und wie lange diese dauert.

Diese Information kann schon im Voraus die Routenplanung beeinflussen. Wähle die Route, die dir genügend lange Raucherpausen ermöglicht, und geniesse deine Reise mit der Gewissheit, dass du jederzeit eine entspannte Zigarette geniessen kannst.

Unser Ziel ist es, dir eine benutzerfreundliche und informative Plattform zu bieten, die dir hilft, deine Reisen in der Schweiz komfortabel und stressfrei zu gestalten.


## Über das Projekt
Der allerwichtigste Schritt war ohne Zweifel das definieren des Mehrwertes zur SBB App. Klar, man könnte einfach einen zweiten Fahrplan machen, aber dass kriegt man wohl kaum hin in dieser Zeit, noch bietet es einen Mehrwert. Deshalb sind wir überzeugt, dass das unsere Applikation mit den Rauchstopps einen grossen Mehrwert für uns Raucher bietet.

## Warum ist unsere App sinnvoll?
Den von kurzen Umsteigezeiten gepeinigten Rauchern wollen wir einen Mehrwert bieten: Nie mehr wieder musst du dich durch unzählige Informationen auf der SBB App ackern um herauszufinden, wo du deinen langersehnten Glimmstängel geniesen kannst. Mit unserer App weisst du schon im Vorhinein, welche Verbindung dir deine Suchtstimulation an welchem Ort erlaubt. Tief durchatmen, Zigi geniesen, und hopps in den nächsten Bus oder Zug steigen.

## Vorgehen
Zuerst erstellten wir auf Papier einen Plan um überhaupt zu wissen, welche Informationen wir wo abrufen müssen. Danach folgte das html Grundgerüst. Die wirkliche Arbeit begann im js-script: Die grösste Schwierigkeit bestand, aus dieser enormen Datenflut der SBB API die richtigen Daten zu fischen. Die Unterpunkte in der API sind oft gleich benannt, was dazu führte, dass wir zu Beginn oft die falschen Informationen kriegten. Der grösste Knackpunkt war das Anzeigen des Gleises, beziehungsweise die Umbennenung zu "Kante", sollte es sich um einen Bus handeln. Ebenso mussten wir nach dem Prinzip "kill your darlings" handeln und gewisse Informationen wieder rausstreichen, da sie shclicht nicht relevant waren für uns. Am Ende folgte die Stilisierung im CSS. Das darf man ohne zu leugnen las den gemütlichsten und befriedigsten Teil der Arbeit deklarieren, da es ab da so richtig an Form angenommen hat.

## Reflexion zum Projekt
Das Programmierprojekt im Rahmen unseres Studiums war eine lehrreiche und herausfordernde Erfahrung, die uns als Team wachsen liess und unser Verständnis für die Arbeit mit APIs vertiefte.

## Learnings und Herausforderungen
Zu Beginn des Projekts war es eine Herausforderung, ein strukturiertes Vorgehen im Team zu finden, da jeder von uns an einem anderen Problem arbeitete. Es dauerte eine Weile, bis wir uns tiefer in das Projekt eingearbeitet hatten und effektiv zusammenarbeiten konnten. Durch die intensive Beschäftigung mit der Materie gelang es uns jedoch, unsere Arbeitsweise zu optimieren und das Projekt erfolgreich voranzutreiben.

Ein weiterer wichtiger Lernprozess war der Umgang mit der API. Anfangs fühlte es sich an, als würden wir nur "Bahnhof" verstehen, wenn es um das Auslesen und Verarbeiten der Daten ging. Doch je mehr wir uns mit der API auseinandersetzten, desto mehr Spass bereitete es uns, tiefer in die Materie einzutauchen. Wir haben nun ein besseres Verständnis dafür, wie man solche Daten effizient nutzen kann.
Für zukünftige Projekte ist es wichtig, dass wir uns nicht in zu spezifischen Details verlieren. Stattdessen sollten wir den Fokus auf die wesentlichen Aspekte legen und uns nicht in Nebensächlichkeiten verzetteln.

## Schwierigkeiten und Verbesserungspotenzial
Eine der grössten Herausforderungen bestand darin, mit der Fülle an Informationen umzugehen, die die API bereitstellte. Aufgrund der Vielzahl an unterschiedlichen Transportmitteln und Stationen war es uns nicht möglich, alle Daten so zu verarbeiten, wie wir es ursprünglich geplant hatten. Dies führte dazu, dass die angezeigten Routen möglicherweise nicht vollständig mit dem SBB Fahrplan übereinstimmen.

Für zukünftige Projekte sollten wir uns im Vorfeld genauer überlegen, welche Informationen wir tatsächlich benötigen und wie wir diese am besten aufbereiten können. Durch eine sorgfältige Planung und Priorisierung können wir sicherstellen, dass die wichtigsten Aspekte korrekt dargestellt werden und etwaige Abweichungen minimiert werden.

Insgesamt war das Programmierprojekt eine wertvolle Erfahrung, die uns nicht nur fachlich weitergebracht hat, sondern auch unsere Teamfähigkeit und Problemlösungskompetenz gestärkt hat. Wir sind zuversichtlich, dass wir die gewonnenen Erkenntnisse in zukünftigen Projekten erfolgreich anwenden werden.


## Teamarbeit

Der Raucher-Reiseplaner entstand durch die Zusammenarbeit unseres dreiköpfigen Teams, in dem jeder seine individuellen Stärken einbrachte. Claudio war mit seiner Expertise verantwortlich für die reibungslose technische Umsetzung des Projekts. Aaron verlieh unserem Projekt die nötige Würze was die benutzerfreundlichkeit und Gestaltung betrifft. Simon, mit seiner Erfahrung im Marketing, kümmerte sich um die Teamseite und das Kontaktformular.

Style: Es war unser bestreben, die Seite möglichst "slick" und "clean" zu halten. Deshalb verzichteten wir auf grosse Spielereien und haben uns an einer professionellen Darstellung wie die des SBB Apps gehalten. Responsiv sind gewisse Schriften, Buttons und die div Boxen.

Validierung: Nachdem die Seiten erstellt waren, haben wir sie sorgfältig validiert. Wir haben sicherzustellen versucht, dass der HTML- und CSS-Code fehlerfrei und standardkonform ist.

Feinschliff: Zum Abschluss haben wir unsere Seiten einem Feinschliff unterzogen, dass alle Elemente gut platziert und gestaltet sind. Darüber hinaus haben wir sicherzustellen versucht, dass die Webseite auf verschiedenen Bildschirmgrössen und Geräten gut aussieht.

Durch die koordinierte Zusammenarbeit und die klare Aufgabenverteilung konnten wir den Raucher-Reiseplaner erfolgreich entwickeln.



## Projektverwaltung und Beitragende
Das Projekt wird von einem engagierten Team geleitet:

- **Aaron Täschler:** Design & Programming <a href="https://github.com/NarronTheNarr">@Dune005</a> <br>
- **Claudio Riz:** Design & Programming <a href="https://github.com/Dune005">@NarronTheNarr</a> <br>
- **Simon Kuhn:** Design & Programming <a href="https://github.com/SHISHAYOLO">@SHISHAYOLO</a> <br>

## Hilfsmittel
Folgende Hilfsmittel wurden verwendet:

- YouTube-Tutorials
- ChatGPT
- GitHub Copilot
- BLACKBOX AI
- w3schools.com

## Dank
Einen grossen Dank wollen wir unseren Dozenten ausprechen:
- Wolfgang Bock
- Jan Fiess
- Alen Doko
- Nils Solanki
- Nina Grössli