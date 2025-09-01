function VideoCard({ video, onSelect, openInLightbox }) {
    const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
    const publishedDate = new Date(video.snippet.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const handleClick = () => {
        if (openInLightbox) {
            onSelect(video);
        }
    };

    const cardContent = (
        <div className={`video-card ${openInLightbox ? 'clickable' : ''}`}>
            <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} loading="lazy" />
            <div className="video-card-content">
                <h3>{video.snippet.title}</h3>
                <p className="video-date">{publishedDate}</p>
            </div>
        </div>
    );

    if (openInLightbox) {
        return (
            <div onClick={handleClick} className="video-card-link">
                {cardContent}
            </div>
        );
    }

    return (
        <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="video-card-link">
            {cardContent}
        </a>
    );
}
