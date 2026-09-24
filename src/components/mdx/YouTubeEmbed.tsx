export function YouTubeEmbed({ videoId, title = "YouTube video" }: { videoId: string; title?: string }) {
  if (!/^[a-zA-Z0-9_-]{6,20}$/.test(videoId)) return null;
  return (
    <div className="my-6 aspect-video w-full overflow-hidden rounded-xl border border-border bg-media">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="size-full"
      />
    </div>
  );
}
