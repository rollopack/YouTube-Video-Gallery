// --- Versione Modificata per Configurazione Centralizzata e Dati Dinamici ---
function App() {
    // Carica la configurazione statica e i dati dinamici iniziali da PHP
    const config = window.__CONFIG__ || {};
    const initialData = window.__INITIAL_DATA__ || {};

    const [videos, setVideos] = React.useState(initialData.videos || []);
    const [nextPageToken, setNextPageToken] = React.useState(initialData.nextPageToken || '');
    const [logoUrl, setLogoUrl] = React.useState(initialData.logoUrl || '');
    const [pageTitle, setPageTitle] = React.useState(initialData.pageTitle || 'Video Gallery');

    const [loading, setLoading] = React.useState(false);
    const [initialLoading, setInitialLoading] = React.useState(!initialData.videos);

    // Aggiorna il titolo del documento quando lo stato cambia
    React.useEffect(() => {
        document.title = pageTitle;
    }, [pageTitle]);

    const fetchVideos = (pageToken = '') => {
        if (loading) return;
        setLoading(true);

        // Usa la configurazione iniettata da PHP per le chiamate API
        const apiKey = config.apiKey;
        const channelId = config.channelId;

        fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=12&pageToken=${pageToken}`)
            .then(response => response.json())
            .then(data => {
                if (data.items) {
                    setVideos(prevVideos => [...prevVideos, ...data.items]);
                    setNextPageToken(data.nextPageToken);
                }
                setLoading(false);
                if (initialLoading) {
                    setInitialLoading(false);
                }
            })
            .catch(error => {
                console.error('Error fetching videos:', error);
                setLoading(false);
                if (initialLoading) {
                    setInitialLoading(false);
                }
            });
    };

    // Esegui il fetch iniziale solo se i dati non sono stati forniti da PHP.
    React.useEffect(() => {
        if (videos.length === 0 && config.apiKey) { // Assicurati che la config sia caricata
            fetchVideos();
        }
    }, [config]); // Dipende dalla config

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 100 || !nextPageToken || loading) {
            return;
        }
        fetchVideos(nextPageToken);
    };

    React.useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [nextPageToken, loading]);

    // La struttura JSX deve corrispondere a quella generata da PHP per un'idratazione corretta.
    return (
        <div>
            <div className="header">
                <img src={logoUrl} alt={`${pageTitle} Logo`} className="logo" />
                <h1>{pageTitle}</h1>
            </div>
            <VideoGrid videos={videos} initialLoading={initialLoading} />
            {loading && !initialLoading && <p className="loading-indicator">Loading more videos...</p>}
        </div>
    );
}

// Usa ReactDOM.hydrate() invece di .render() per "attaccarsi" all'HTML esistente.
ReactDOM.hydrate(<App />, document.getElementById('root'));
