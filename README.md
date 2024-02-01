# Progetto Pong
## Test di Sviluppatore in Node.js
### v01.0.0 (01/02/2024)

#### Documentazione:

Questo codice è un'applicazione di gioco Pong realizzata utilizzando Node.js, Express e Socket.IO. Il gioco coinvolge due giocatori che controllano ciascuno una pala e cercano di colpire una palla facendola rimbalzare tra le palette. Di seguito sono fornite alcune informazioni chiave sulla struttura del codice:

#### Setup Iniziale:

- Il server viene avviato sulla porta 3000.
- Viene utilizzato Express per gestire le risorse statiche nella cartella 'public'.
- Socket.IO è configurato per gestire la comunicazione in tempo reale tra il server e i client.

#### Gestione delle Connessioni:

- Quando un nuovo giocatore si connette, viene registrato un evento 'connection'.
- Gli eventi 'move' vengono utilizzati per gestire i movimenti delle palette dei giocatori. Le direzioni possibili sono 'up', 'down', 'stop' e 'reset'.

#### Logica di Gioco:

- La posizione della palla viene aggiornata ad intervalli regolari, simulando il suo movimento.
- La logica delle collisioni è implementata per far rimbalzare la palla dai bordi del campo e dalle palette dei giocatori.
- Se la palla supera la linea di fondo su un lato, viene emesso un evento 'goal' indicando il giocatore che ha segnato. Successivamente, il gioco viene resettato.

#### Reset del Gioco:

- La funzione resetGame() reimposta le posizioni della palla e delle palette all'inizio del gioco.

#### Comunicazione con i Client:

- Gli eventi 'updatePaddle' e 'updateBall' vengono utilizzati per comunicare i cambiamenti nella posizione delle palette e della palla ai client.

## Contributi
Contribuisci allo sviluppo di questo progetto! Sentiti libero di segnalare bug, inviare richieste di pull o fornire suggerimenti. Il tuo coinvolgimento è prezioso.

## Licenza
Questo progetto è distribuito con licenza MIT. Consulta il file [LICENSE](LICENSE) per ulteriori dettagli.

## Contatti
Per domande, commenti o collaborazioni, puoi contattarci via e-mail all'indirizzo [albertomaffeii@gmail.com](mailto:albertomaffeii@gmail.com).
