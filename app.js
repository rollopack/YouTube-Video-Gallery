// --- Versione Modificata per Configurazione Centralizzata e Dati Dinamici ---
function App() {
    // Carica la configurazione statica e i dati dinamici iniziali da PHP
    const config = window.__CONFIG__ || {};
    const initialData = window.__INITIAL_DATA__ || {};

    const [videos, setVideos] = React.useState(initialData.videos || []);
    const [nextPageToken, setNextPageToken] = React.useState(initialData.nextPageToken || '');
    const [logoUrl, setLogoUrl] = React.useState(initialData.logoUrl || '');
    const [pageTitle, setPageTitle] = React.useState(initialData.pageTitle || 'Video Gallery');
    const [lightboxVideo, setLightboxVideo] = React.useState(null);

    const [loading, setLoading] = React.useState(false);
    const [initialLoading, setInitialLoading] = React.useState((initialData.videos || []).length === 0);

    // Aggiorna il titolo del documento quando lo stato cambia
    React.useEffect(() => {
        document.title = pageTitle;
    }, [pageTitle]);

    const fetchVideos = (pageToken = '') => {
        if (loading) return;
        setLoading(true);

        fetch(`api.php?pageToken=${pageToken}`)
            .then(response => response.json())
            .then(data => {
                if (data.items) {
                    // Filtra eventuali risultati null o undefined per sicurezza
                    const validItems = data.items.filter(item => item);
                    setVideos(prevVideos => [...prevVideos, ...validItems]);
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

    React.useEffect(() => {
        if (videos.length === 0 && config.apiKey) {
            fetchVideos();
        }
    }, [config]);

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

    const handleVideoSelect = (video) => {
        if (config.openInLightbox) {
            setLightboxVideo(video);
        }
    };

    const closeLightbox = () => {
        setLightboxVideo(null);
    };

    return (
        <div>
            <div className="header">
                <img src={logoUrl} alt={`${pageTitle} Logo`} className="logo" />
                <h1>{pageTitle}</h1>
            </div>
            <VideoGrid
                videos={videos}
                initialLoading={initialLoading}
                onVideoSelect={handleVideoSelect}
                openInLightbox={config.openInLightbox}
            />
            {loading && !initialLoading && <p className="loading-indicator">Loading more videos...</p>}
            <Lightbox video={lightboxVideo} onClose={closeLightbox} />
        </div>
    );
}

// Usa ReactDOM.hydrate() invece di .render() per "attaccarsi" all'HTML esistente.
ReactDOM.hydrate(<App />, document.getElementById('root'));
