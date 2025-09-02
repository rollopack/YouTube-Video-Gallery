<?php
header('Content-Type: application/json');

// --- Inizio Blocco PHP per la Gestione delle Chiamate API ---

// Carica la configurazione da file JSON
$configJson = file_get_contents('config.json');
$config = json_decode($configJson);

// Inizializza le variabili e le costanti dalla configurazione
$apiKey = $config->apiKey;
$channelId = $config->channelId;
$cacheDurationInSeconds = ($config->cacheDurationHours ?? 6) * 3600;
$pageToken = isset($_GET['pageToken']) ? $_GET['pageToken'] : '';

// Definisci un percorso di cache univoco per ogni pagina di risultati
$cacheFile = 'cache/youtube_data_' . preg_replace('/[^A-Za-z0-9_\-]/', '', $pageToken) . '.json';
define('CACHE_FILE_PATH', $cacheFile);

// Funzione per chiamare l'API di YouTube con un pageToken
function fetch_videos_from_youtube($pageToken) {
    global $apiKey, $channelId;
    $url = sprintf(
        'https://www.googleapis.com/youtube/v3/search?key=%s&channelId=%s&part=snippet,id&order=date&maxResults=12&pageToken=%s',
        $apiKey,
        $channelId,
        $pageToken
    );

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
    $output = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code == 200) {
        $data = json_decode($output, true);
        $videos = [];
        if (!empty($data['items'])) {
            $videos = array_filter($data['items'], function($item) {
                return isset($item['id']['kind']) && $item['id']['kind'] === 'youtube#video';
            });
        }
        return [
            'items' => array_values($videos), // Usa 'items' per coerenza con l'API di YouTube e il frontend
            'nextPageToken' => $data['nextPageToken'] ?? ''
        ];
    }
    return ['items' => [], 'nextPageToken' => ''];
}

// Logica di Caching
$cacheDir = dirname(CACHE_FILE_PATH);
if (!is_dir($cacheDir)) {
    @mkdir($cacheDir, 0755, true);
}

if (file_exists(CACHE_FILE_PATH) && (time() - filemtime(CACHE_FILE_PATH) < $cacheDurationInSeconds)) {
    // Cache Hit: Carica i dati dalla cache e inviali.
    $cachedDataJson = file_get_contents(CACHE_FILE_PATH);
    echo $cachedDataJson;
} else {
    // Cache Miss: Recupera i dati freschi.
    $api_data = fetch_videos_from_youtube($pageToken);

    // Converte in JSON per l'output e la cache
    $jsonData = json_encode($api_data);

    // Salva i dati freschi nella cache, solo se la directory è scrivibile.
    if (is_dir($cacheDir) && is_writable($cacheDir)) {
        file_put_contents(CACHE_FILE_PATH, $jsonData, LOCK_EX);
    }

    // Invia i dati freschi al client.
    echo $jsonData;
}

// --- Fine Blocco PHP ---
?>
