function Lightbox({ video, onClose }) {
    if (!video) {
        return null;
    }

    const embedUrl = `https://www.youtube.com/embed/${video.id.videoId}?autoplay=1`;

    // Evita la chiusura della lightbox quando si clicca sul video
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="lightbox-overlay" onClick={onClose}>
            <div className="lightbox-content" onClick={handleContentClick}>
                <button className="lightbox-close" onClick={onClose}>&times;</button>
                <div className="lightbox-video-container">
                    <iframe
                        src={embedUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video.snippet.title}
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
