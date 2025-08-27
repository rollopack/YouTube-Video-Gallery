function App() {
    const [videos, setVideos] = React.useState([]);
    const [nextPageToken, setNextPageToken] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [initialLoading, setInitialLoading] = React.useState(true);

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

    React.useEffect(() => {
        fetchVideos();
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

ReactDOM.render(<App />, document.getElementById('root'));
