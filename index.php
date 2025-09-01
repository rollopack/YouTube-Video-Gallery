<?php
// --- Inizio Blocco PHP per il Rendering Lato Server ---

require_once 'config.php';

$videos = [];
$nextPageToken = '';
$logoUrl = FALLBACK_LOGO_URL; // Inizializza con il logo di fallback

// Funzione per chiamare l'API di YouTube
function fetch_initial_videos() {
    $url = sprintf(
        'https://www.googleapis.com/youtube/v3/search?key=%s&channelId=%s&part=snippet,id&order=date&maxResults=12&pageToken=',
        API_KEY,
        CHANNEL_ID
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

// Funzione per recuperare dinamicamente il logo del canale
function fetch_channel_logo($channelId) {
    $channelUrl = 'https://www.youtube.com/channel/' . $channelId;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $channelUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Segui i reindirizzamenti
    $html = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code == 200 && $html) {
        // Cerca il meta tag og:image per trovare l'URL del logo
        if (preg_match('/<meta property="og:image" content="([^"]+)">/', $html, $matches)) {
            if (isset($matches[1])) {
                return $matches[1];
            }
        }
    }

    return false;
}

// Recupera i dati iniziali e il logo
$initial_data = fetch_initial_videos();
$videos = $initial_data['videos'];
$nextPageToken = $initial_data['nextPageToken'];

$dynamicLogo = fetch_channel_logo(CHANNEL_ID);
if ($dynamicLogo) {
    $logoUrl = $dynamicLogo;
}

// --- Fine Blocco PHP ---
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Food Lovers</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="root">
        <?php // --- Inizio Rendering HTML Dinamico --- ?>
        <div>
            <div class="header">
                <img src="<?php echo htmlspecialchars($logoUrl); ?>" alt="Food Lovers Logo" class="logo" />
                <h1>Food Lovers</h1>
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
        window.__INITIAL_DATA__ = <?php echo json_encode(['videos' => $videos, 'nextPageToken' => $nextPageToken]); ?>;
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
