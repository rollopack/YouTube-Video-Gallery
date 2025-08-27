function VideoGrid({ videos, onVideoSelect }) {
    return (
        <div className="video-grid">
            {videos.map(video => (
                <VideoCard key={video.id.videoId} video={video} onVideoSelect={onVideoSelect} />
            ))}
        </div>
    );
}
