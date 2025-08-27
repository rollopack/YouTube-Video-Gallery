function VideoGrid({ videos, initialLoading }) {
    if (initialLoading) {
        return (
            <div className="video-grid">
                {Array.from({ length: 12 }).map((_, index) => (
                    <PlaceholderCard key={index} />
                ))}
            </div>
        );
    }

    return (
        <div className="video-grid">
            {videos.map(video => (
                <VideoCard key={video.id.videoId} video={video} />
            ))}
        </div>
    );
}
