<?php
// --- Inizio Blocco PHP per il Rendering Lato Server ---

// Carica la configurazione da file JSON
$configJson = file_get_contents('config.json');
$config = json_decode($configJson);

// Inizializza le variabili dalla configurazione
$apiKey = $config->apiKey;
$channelId = $config->channelId;
$logoUrl = $config->fallbackLogoUrl;
$pageTitle = $config->fallbackTitle;

$videos = [];
$nextPageToken = '';

// Funzione per chiamare l'API di YouTube
function fetch_initial_videos() {
    global $apiKey, $channelId;
    $url = sprintf(
        'https://www.googleapis.com/youtube/v3/search?key=%s&channelId=%s&part=snippet,id&order=date&maxResults=12&pageToken=',
        $apiKey,
        $channelId
    );

    // Inizializza cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    // Aggiungi un User-Agent per evitare blocchi
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
    $output = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code == 200) {
        $data = json_decode($output, true);
        return [
            'videos' => $data['items'] ?? [],
            'nextPageToken' => $data['nextPageToken'] ?? ''
        ];
    }
    return ['videos' => [], 'nextPageToken' => ''];
}

// Funzione per recuperare dinamicamente i metadati del canale (titolo e logo)
function fetch_channel_metadata($channelId) {
    $channelUrl = 'https://www.youtube.com/channel/' . $channelId;
    $metadata = ['title' => false, 'logoUrl' => false];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $channelUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    $html = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code == 200 && $html) {
        // Estrai il titolo dal tag <title>
        if (preg_match('/<title>(.+)<\/title>/', $html, $titleMatches)) {
            $metadata['title'] = trim($titleMatches[1]);
        }

        // Estrai l'URL del logo dal meta tag og:image
        if (preg_match('/<meta property="og:image" content="([^"]+)">/', $html, $logoMatches)) {
            $metadata['logoUrl'] = $logoMatches[1];
        }
    }

    return $metadata;
}

// Recupera i dati
$initial_data = fetch_initial_videos();
$videos = $initial_data['videos'];
$nextPageToken = $initial_data['nextPageToken'];

$channel_metadata = fetch_channel_metadata($channelId);
if ($channel_metadata['title']) {
    $pageTitle = $channel_metadata['title'];
}
if ($channel_metadata['logoUrl']) {
    $logoUrl = $channel_metadata['logoUrl'];
}

// --- Fine Blocco PHP ---
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($pageTitle); ?></title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="root">
        <?php // --- Inizio Rendering HTML Dinamico --- ?>
        <div>
            <div class="header">
                <img src="<?php echo htmlspecialchars($logoUrl); ?>" alt="<?php echo htmlspecialchars($pageTitle); ?> Logo" class="logo" />
                <h1><?php echo htmlspecialchars($pageTitle); ?></h1>
            </div>
            <?php if (!empty($videos)): ?>
                <div class="video-grid">
                    <?php foreach ($videos as $video): ?>
                        <?php
                            if (empty($video['id']['videoId'])) continue;
                            $videoUrl = 'https://www.youtube.com/watch?v=' . $video['id']['videoId'];
                            // Formatta la data come 'M d, YYYY' (es. Aug 31, 2025)
                            $publishedDate = date_format(date_create($video['snippet']['publishedAt']), 'M j, Y');
                        ?>
                        <a href="<?php echo htmlspecialchars($videoUrl); ?>" target="_blank" rel="noopener noreferrer" class="video-card-link">
                            <div class="video-card">
                                <img src="<?php echo htmlspecialchars($video['snippet']['thumbnails']['medium']['url']); ?>" alt="<?php echo htmlspecialchars($video['snippet']['title']); ?>" loading="lazy" />
                                <div class="video-card-content">
                                    <h3><?php echo htmlspecialchars($video['snippet']['title']); ?></h3>
                                    <p class="video-date"><?php echo $publishedDate; ?></p>
                                </div>
                            </div>
                        </a>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <p>Could not load videos. Please check the API key and channel ID.</p>
            <?php endif; ?>
        </div>
        <?php // --- Fine Rendering HTML Dinamico --- ?>
    </div>

    <script>
        window.__CONFIG__ = <?php echo json_encode(['apiKey' => $apiKey, 'channelId' => $channelId]); ?>;
        window.__INITIAL_DATA__ = <?php echo json_encode(['videos' => $videos, 'nextPageToken' => $nextPageToken, 'pageTitle' => $pageTitle, 'logoUrl' => $logoUrl]); ?>;
    </script>

    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
    <script type="text/babel" src="components/VideoCard.js"></script>
    <script type="text/babel" src="components/PlaceholderCard.js"></script>
    <script type="text/babel" src="components/VideoGrid.js"></script>
    <script type="text/babel" src="app.js"></script>
</body>
</html>
