/**
 * KAYROS CENTER - SERVICIO DE AUTOMATIZACIÓN DE YOUTUBE
 * Canal: Kayros Center (ID: UCmTN4lxCbqbX1zjHZ8EuyYg)
 * 
 * Este módulo permite obtener automáticamente los últimos videos subidos o
 * transmitidos en vivo desde el canal oficial de YouTube sin requerir claves de pago.
 */

const YOUTUBE_CONFIG = {
  channelId: 'UCmTN4lxCbqbX1zjHZ8EuyYg',
  channelUrl: 'https://www.youtube.com/channel/UCmTN4lxCbqbX1zjHZ8EuyYg',
  rssFeedUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCmTN4lxCbqbX1zjHZ8EuyYg',
  // Videos oficiales de respaldo (fallbacks inmediatos en caso de estar offline o sin red)
  fallbackVideos: [
    {
      id: 'tW5rVs9If9g',
      title: '"ACTIVANDO TU DESTINO PROFÉTICO" · Ps. Mauricio Silva',
      speaker: 'Rev. Mauricio Silva · Kayros Center Villavicencio',
      tag: 'ÚLTIMO MENSAJE'
    },
    {
      id: 'HTpFIvAw_V4',
      title: 'AVANZANDO A NUESTRO DESTINO PROFÉTICO · Profeta Santiago Castellanos (Domingo)',
      speaker: 'Profeta Santiago Castellanos · Kayros Center',
      tag: 'DOMINGO ANTERIOR'
    },
    {
      id: 'KOzAJT655i0',
      title: 'AVANZANDO A NUESTRO DESTINO PROFÉTICO: Las 4 Dimensiones · Profeta Santiago Castellanos',
      speaker: 'Profeta Santiago Castellanos · Kayros Center',
      tag: 'SERIE PROFÉTICA'
    }
  ]
};

/**
 * Obtiene los últimos videos usando el RSS Feed oficial convertido a JSON.
 * No requiere Google Cloud API Key ni cuotas de pago.
 */
async function fetchLatestYouTubeVideos(limit = 3) {
  try {
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(YOUTUBE_CONFIG.rssFeedUrl)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    if (data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
      return data.items.slice(0, limit).map((item, index) => {
        // Extraer el ID del video desde el guid / link: https://www.youtube.com/watch?v=VIDEO_ID
        const videoId = item.guid ? item.guid.replace('yt:video:', '') : extractVideoId(item.link);
        return {
          id: videoId,
          title: item.title,
          speaker: item.author || 'Kayros Center Villavicencio',
          tag: index === 0 ? 'ÚLTIMO MENSAJE' : `RECIENTE`,
          pubDate: item.pubDate,
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          link: `https://www.youtube.com/watch?v=${videoId}`
        };
      });
    }
    return YOUTUBE_CONFIG.fallbackVideos;
  } catch (err) {
    console.warn('YouTubeService: Usando lista local de respaldo.', err);
    return YOUTUBE_CONFIG.fallbackVideos;
  }
}

function extractVideoId(url) {
  if (!url) return '';
  const match = url.match(/(?:watch\?v=|\/live\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : '';
}

// Exportar para uso en frontend
window.KayrosYouTube = {
  config: YOUTUBE_CONFIG,
  fetchLatest: fetchLatestYouTubeVideos
};
