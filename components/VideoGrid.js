function VideoGrid({ videos }) {
    return (
        <div className="video-grid">
            {videos.map(video => (
                <VideoCard key={video.id.videoId} video={video} />
            ))}
        </div>
    );
}
