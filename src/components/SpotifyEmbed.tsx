type Props = {
  trackId: string;
  compact?: boolean;
};

/**
 * Spotify track embed.
 * To swap a track: open the song in Spotify, right-click → Share → Copy Song Link,
 * then paste only the segment after `/track/` (before the `?`) as the trackId.
 */
export function SpotifyEmbed({ trackId, compact = false }: Props) {
  const height = compact ? 80 : 152;
  return (
    <iframe
      title={`Spotify track ${trackId}`}
      src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=1`}
      width="100%"
      height={height}
      style={{ borderRadius: 12 }}
      frameBorder={0}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
