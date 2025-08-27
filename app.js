function App() {
    const [videos, setVideos] = React.useState([]);

    const API_KEY = 'YOUR_API_KEY'; // IMPORTANT: Replace with your YouTube Data API key
    const CHANNEL_ID = 'UCZjrNGpSA9XyfAwjAPTFFmQ';
    const LOGO_URL = 'https://yt3.googleusercontent.com/JlAO7XAr-xQBvP0KCnHcvubDfRdH6ZXXul5o79uOloRG8AC9wq_SLtaeH-Du14MEpCV82fjvjg=s160-c-k-c0x00ffffff-no-rj';

    React.useEffect(() => {
        fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50`)
            .then(response => response.json())
            .then(data => {
                if (data.items) {
                    setVideos(data.items);
                }
            })
            .catch(error => {
                console.error('Error fetching videos:', error);
            });
    }, []);

    return (
        <div>
            <div className="header">
                <img src={LOGO_URL} alt="Food Lovers Logo" className="logo" />
                <h1>Food Lovers</h1>
            </div>
            <VideoGrid videos={videos} />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
