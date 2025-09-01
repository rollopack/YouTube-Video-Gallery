// --- Versione Modificata per l'Idratazione ---
function App() {
    // Inizializza lo stato con i dati passati da PHP, se disponibili.
    const initialData = window.__INITIAL_DATA__ || {};
    const [videos, setVideos] = React.useState(initialData.videos || []);
    const [nextPageToken, setNextPageToken] = React.useState(initialData.nextPageToken || '');

    const [loading, setLoading] = React.useState(false);
    // L'initialLoading non è più necessario perché i dati sono già presenti.
    const [initialLoading, setInitialLoading] = React.useState(!initialData.videos);

    // Le costanti sono ancora necessarie per le chiamate API successive (scroll infinito).
    const API_KEY = 'AIzaSyAum9UGshqFyeN__u3SeN_Wnia1EKl6qOY';
    const CHANNEL_ID = 'UCZjrNGpSA9XyfAwjAPTFFmQ';
    const LOGO_URL = 'https://yt3.googleusercontent.com/JlAO7XAr-xQBvP0KCnHcvubDfRdH6ZXXul5o79uOloRG8AC9wq_SLtaeH-Du14MEpCV82fjvjg=s160-c-k-c0x00ffffff-no-rj';

    const fetchVideos = (pageToken = '') => {
        if (loading) return;
        setLoading(true);

        fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=12&pageToken=${pageToken}`)
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
        if (videos.length === 0) {
            fetchVideos();
        }
    }, []);

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
                <img src={LOGO_URL} alt="Food Lovers Logo" className="logo" />
                <h1>Food Lovers</h1>
            </div>
            <VideoGrid videos={videos} initialLoading={initialLoading} />
            {loading && !initialLoading && <p className="loading-indicator">Loading more videos...</p>}
        </div>
    );
}

// Usa ReactDOM.hydrate() invece di .render() per "attaccarsi" all'HTML esistente.
ReactDOM.hydrate(<App />, document.getElementById('root'));
