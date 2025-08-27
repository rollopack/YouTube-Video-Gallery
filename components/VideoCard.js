function VideoCard({ video, onVideoSelect }) {
    return (
        <div className="video-card" onClick={() => onVideoSelect(video)}>
            <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} loading="lazy" />
            <h3>{video.snippet.title}</h3>
        </div>
    );
}
