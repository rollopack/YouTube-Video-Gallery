# YouTube API Video Gallery

## Descrizione

Questa è una galleria video semplice e ad alte prestazioni che utilizza PHP per il Server-Side Rendering (SSR) e React per l'idratazione lato client. Questo approccio ibrido garantisce un caricamento iniziale rapidissimo e un'ottima indicizzazione per i motori di ricerca (SEO), mantenendo al contempo un'esperienza utente fluida e interattiva.

## Funzionalità Principali

- **Server-Side Rendering (SSR):** La pagina iniziale viene generata interamente sul server con PHP, riducendo i tempi di caricamento percepiti.
- **Idratazione con React:** React prende il controllo della pagina sul client per gestire l'interattività, come lo scroll infinito e la riproduzione dei video.
- **Caching Lato Server:** I dati dell'API di YouTube vengono salvati in una cache sul server per un periodo configurabile, riducendo drasticamente il numero di chiamate API e proteggendo dai limiti di quota.
- **Metadati Dinamici:** Il titolo della pagina e il logo del canale vengono recuperati e aggiornati dinamicamente.
- **Lightbox Configurabile:** È possibile scegliere se aprire i video in una lightbox modale o in una nuova scheda del browser tramite un'impostazione nel file di configurazione.
- **Configurazione Esternalizzata:** Tutte le impostazioni sono gestite in un unico file `config.json`.

## Installazione e Avvio

1.  **Prerequisiti:** Assicurati di avere [PHP](https://www.php.net/manual/en/install.php) installato sul tuo sistema, incluse le estensioni `curl` e `json`.
2.  **Clona il Repository:**
    ```bash
    git clone <URL_DEL_REPOSITORY>
    cd <NOME_DELLA_CARTELLA>
    ```
3.  **Configurazione:** Rinomina `config.json.example` in `config.json` (se presente) e inserisci le tue credenziali. Se il file non esiste, crealo seguendo la struttura descritta sotto.
4.  **Avvia il Server:** Esegui il server di sviluppo integrato di PHP.
    ```bash
    php -S localhost:8000
    ```
5.  **Apri nel Browser:** Visita `http://localhost:8000` nel tuo browser.

## Configurazione (`config.json`)

Questo file contiene tutte le impostazioni necessarie per l'applicazione.

```json
{
  "apiKey": "LA_TUA_CHIAVE_API_QUI",
  "channelId": "ID_DEL_CANALE_YOUTUBE_QUI",
  "fallbackLogoUrl": "URL_DI_UN_LOGO_DI_FALLBACK",
  "fallbackTitle": "Titolo di Fallback",
  "openInLightbox": true,
  "cacheDurationHours": 6
}
```

-   `apiKey`: La tua chiave API per la YouTube Data API v3.
-   `channelId`: L'ID del canale YouTube da cui vuoi visualizzare i video.
-   `fallbackLogoUrl`: Un URL a un'immagine da usare come logo se il recupero dinamico fallisce.
-   `fallbackTitle`: Un titolo da usare per la pagina se il recupero dinamico fallisce.
-   `openInLightbox`: Imposta su `true` per aprire i video in una lightbox, o `false` per aprirli in una nuova scheda.
-   `cacheDurationHours`: Il numero di ore per cui i dati dell'API vengono conservati nella cache del server.

---

### Come Ottenere la Chiave API e l'ID del Canale

#### Chiave API di YouTube (API Key)

1.  **Vai alla Google Cloud Console:** [https://console.cloud.google.com/](https://console.cloud.google.com/)
2.  **Crea un Nuovo Progetto:** Se non ne hai già uno, crea un nuovo progetto.
3.  **Abilita l'API di YouTube:**
    -   Nel menu di navigazione, vai su "API e servizi" > "Libreria".
    -   Cerca "YouTube Data API v3" e abilitala per il tuo progetto.
4.  **Crea le Credenziali:**
    -   Vai su "API e servizi" > "Credenziali".
    -   Fai clic su "CREA CREDENZIALI" e seleziona "Chiave API".
    -   Copia la chiave generata e incollala nel tuo `config.json`.
    -   **Importante:** Per motivi di sicurezza, è consigliabile limitare la chiave API per consentire solo le richieste provenienti dai domini del tuo sito web.

#### ID del Canale (Channel ID)

1.  **Visita la Pagina del Canale:** Vai sulla pagina principale del canale YouTube che ti interessa.
2.  **Trova l'ID nell'URL:** L'ID del canale è una stringa che inizia con `UC` e si trova nell'URL.
    -   Esempio: `https://www.youtube.com/channel/UCZjrNGpSA9XyfAwjAPTFFmQ`
    -   In questo caso, l'ID è `UCZjrNGpSA9XyfAwjAPTFFmQ`.
3.  **Copia l'ID** e incollalo nel tuo `config.json`.
