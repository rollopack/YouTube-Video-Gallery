function VideoCard({ video, onSelect, openInLightbox }) {
    const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
    const publishedDate = new Date(video.snippet.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Determina il componente wrapper e le sue props in base alla configurazione
    const Wrapper = openInLightbox ? 'div' : 'a';
    const wrapperProps = {
        className: 'video-card-link'
    };

    if (openInLightbox) {
        wrapperProps.onClick = () => onSelect(video);
    } else {
        wrapperProps.href = videoUrl;
        wrapperProps.target = '_blank';
        wrapperProps.rel = 'noopener noreferrer';
    }

    return (
        <Wrapper {...wrapperProps}>
            <div className={`video-card ${openInLightbox ? 'clickable' : ''}`}>
                <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} loading="lazy" />
                <div className="video-card-content">
                    <h3>{video.snippet.title}</h3>
                    <p className="video-date">{publishedDate}</p>
                </div>
            </div>
        </Wrapper>
    );
}
