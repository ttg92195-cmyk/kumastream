'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, Save, Loader2, Plus, X, Link as LinkIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Episode {
  id: string;
  season: number;
  episode: number;
  title: string;
  duration: number;
  fileSize?: string;
  quality?: string;
  format?: string;
  downloadLinks?: Array<{ quality: string; link: string }>;
}

interface Series {
  id: string;
  title: string;
  year: number;
  rating: number;
  poster: string | null;
  backdrop: string | null;
  description: string;
  genres: string;
  quality4k: boolean;
  seasons: number;
  totalEpisodes: number;
  casts?: Array<{ id: string; name: string; role: string; photo?: string | null }>;
  episodes: Episode[];
}

export default function EditSeriesPage() {
  const { admin } = useAppStore();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expandedSeasons, setExpandedSeasons] = useState<Set<number>>(new Set([1]));

  // Form state
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(2024);
  const [rating, setRating] = useState(0);
  const [poster, setPoster] = useState('');
  const [backdrop, setBackdrop] = useState('');
  const [description, setDescription] = useState('');
  const [genres, setGenres] = useState('');
  const [quality4k, setQuality4k] = useState(false);
  const [seasons, setSeasons] = useState(1);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    if (!admin) {
      router.push('/admin/login');
      return;
    }

    // Fetch series data
    fetch(`/api/series/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.series) {
          const s = data.series;
          setSeries(s);
          setTitle(s.title || '');
          setYear(s.year || 2024);
          setRating(s.rating || 0);
          setPoster(s.poster || '');
          setBackdrop(s.backdrop || '');
          setDescription(s.description || '');
          setGenres(s.genres || '');
          setQuality4k(s.quality4k || false);
          setSeasons(s.seasons || 1);
          setTotalEpisodes(s.totalEpisodes || 0);
          setEpisodes(s.episodes || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [admin, router, id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/series/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          year,
          rating,
          poster,
          backdrop,
          description,
          genres,
          quality4k,
          seasons,
          totalEpisodes,
          episodes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Series updated successfully!');
        router.push('/admin/dashboard');
      } else {
        alert('Error: ' + (data.error || 'Failed to update series'));
      }
    } catch (error) {
      console.error(error);
      alert('Failed to update series');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/series/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('Series deleted successfully!');
        router.push('/admin/dashboard');
      } else {
        alert('Error: ' + (data.error || 'Failed to delete series'));
      }
    } catch (error) {
      console.error(error);
      alert('Failed to delete series');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const toggleSeason = (seasonNum: number) => {
    const newExpanded = new Set(expandedSeasons);
    if (newExpanded.has(seasonNum)) {
      newExpanded.delete(seasonNum);
    } else {
      newExpanded.add(seasonNum);
    }
    setExpandedSeasons(newExpanded);
  };

  const updateEpisodeDownloadLinks = (
    episodeId: string,
    links: Array<{ quality: string; link: string }>
  ) => {
    setEpisodes(
      episodes.map((ep) =>
        ep.id === episodeId ? { ...ep, downloadLinks: links } : ep
      )
    );
  };

  const addDownloadLinkToEpisode = (episodeId: string) => {
    setEpisodes(
      episodes.map((ep) =>
        ep.id === episodeId
          ? { ...ep, downloadLinks: [...(ep.downloadLinks || []), { quality: '', link: '' }] }
          : ep
      )
    );
  };

  const updateEpisodeLink = (
    episodeId: string,
    linkIndex: number,
    field: 'quality' | 'link',
    value: string
  ) => {
    setEpisodes(
      episodes.map((ep) => {
        if (ep.id === episodeId && ep.downloadLinks) {
          const newLinks = [...ep.downloadLinks];
          newLinks[linkIndex][field] = value;
          return { ...ep, downloadLinks: newLinks };
        }
        return ep;
      })
    );
  };

  const removeEpisodeLink = (episodeId: string, linkIndex: number) => {
    setEpisodes(
      episodes.map((ep) => {
        if (ep.id === episodeId && ep.downloadLinks) {
          return {
            ...ep,
            downloadLinks: ep.downloadLinks.filter((_, i) => i !== linkIndex),
          };
        }
        return ep;
      })
    );
  };

  // Group episodes by season
  const episodesBySeason = episodes.reduce((acc, ep) => {
    if (!acc[ep.season]) {
      acc[ep.season] = [];
    }
    acc[ep.season].push(ep);
    return acc;
  }, {} as Record<number, Episode[]>);

  if (!admin) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-gray-400">Series not found</p>
      </div>
    );
  }

  const isEditable = id.startsWith('tmdb-');

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0f0f0f] border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-red-500">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white font-bold text-lg">Edit Series</h1>
          </div>
          <div className="flex items-center gap-2">
            {isEditable && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600/20 text-red-500 rounded-lg text-sm font-medium hover:bg-red-600/30"
              >
                Delete
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !isEditable}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors',
                isEditable && !saving
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              )}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {!isEditable && (
        <div className="p-4 bg-yellow-500/20 border-b border-yellow-500/50">
          <p className="text-yellow-500 text-sm">
            ⚠️ This is a static series and cannot be edited. Only TMDB imported series can be modified.
          </p>
        </div>
      )}

      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Poster Preview */}
        {poster && (
          <div className="flex justify-center">
            <div className="relative w-40 aspect-[2/3] rounded-lg overflow-hidden">
              <Image
                src={poster}
                alt={title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
          <h2 className="text-white font-semibold">Basic Information</h2>
          
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!isEditable}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value) || 2024)}
                disabled={!isEditable}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Rating</label>
              <input
                type="number"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value) || 0)}
                disabled={!isEditable}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Seasons</label>
              <input
                type="number"
                value={seasons}
                onChange={(e) => setSeasons(parseInt(e.target.value) || 1)}
                disabled={!isEditable}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Total Episodes</label>
              <input
                type="number"
                value={totalEpisodes}
                onChange={(e) => setTotalEpisodes(parseInt(e.target.value) || 0)}
                disabled={!isEditable}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Genres (comma-separated)</label>
            <input
              type="text"
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              disabled={!isEditable}
              placeholder="Action, Drama, Thriller"
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="quality4k"
              checked={quality4k}
              onChange={(e) => setQuality4k(e.target.checked)}
              disabled={!isEditable}
              className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-red-500 focus:ring-red-500"
            />
            <label htmlFor="quality4k" className="text-gray-300 text-sm">4K Quality Available</label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
          <h2 className="text-white font-semibold">Images</h2>
          
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Poster URL</label>
            <input
              type="text"
              value={poster}
              onChange={(e) => setPoster(e.target.value)}
              disabled={!isEditable}
              placeholder="https://..."
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Backdrop URL</label>
            <input
              type="text"
              value={backdrop}
              onChange={(e) => setBackdrop(e.target.value)}
              disabled={!isEditable}
              placeholder="https://..."
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
          <h2 className="text-white font-semibold">Description</h2>
          
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!isEditable}
              rows={3}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Episodes */}
        <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
          <h2 className="text-white font-semibold">Episodes & Download Links</h2>
          
          {Object.keys(episodesBySeason).length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No episodes found</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(episodesBySeason)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([seasonNum, seasonEpisodes]) => (
                  <div key={seasonNum} className="bg-gray-700/50 rounded-lg overflow-hidden">
                    {/* Season Header */}
                    <button
                      onClick={() => toggleSeason(parseInt(seasonNum))}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-700/70"
                    >
                      <span className="text-white font-medium">
                        Season {seasonNum} ({seasonEpisodes.length} episodes)
                      </span>
                      {expandedSeasons.has(parseInt(seasonNum)) ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {/* Episodes */}
                    {expandedSeasons.has(parseInt(seasonNum)) && (
                      <div className="p-3 pt-0 space-y-3">
                        {seasonEpisodes
                          .sort((a, b) => a.episode - b.episode)
                          .map((ep) => (
                            <div key={ep.id} className="bg-gray-800 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white text-sm font-medium">
                                  Ep {ep.episode}: {ep.title}
                                </span>
                                <span className="text-gray-500 text-xs">{ep.duration} min</span>
                              </div>

                              {/* Download Links */}
                              <div className="space-y-2">
                                {ep.downloadLinks && ep.downloadLinks.length > 0 ? (
                                  ep.downloadLinks.map((link, linkIdx) => (
                                    <div key={linkIdx} className="flex gap-2">
                                      <input
                                        type="text"
                                        value={link.quality}
                                        onChange={(e) =>
                                          updateEpisodeLink(ep.id, linkIdx, 'quality', e.target.value)
                                        }
                                        disabled={!isEditable}
                                        placeholder="Quality"
                                        className="flex-1 bg-gray-700 text-white text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
                                      />
                                      <input
                                        type="text"
                                        value={link.link}
                                        onChange={(e) =>
                                          updateEpisodeLink(ep.id, linkIdx, 'link', e.target.value)
                                        }
                                        disabled={!isEditable}
                                        placeholder="Download URL"
                                        className="flex-[2] bg-gray-700 text-white text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
                                      />
                                      {isEditable && (
                                        <button
                                          onClick={() => removeEpisodeLink(ep.id, linkIdx)}
                                          className="p-1 text-gray-400 hover:text-red-500"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-gray-500 text-xs">No download links</p>
                                )}

                                {isEditable && (
                                  <button
                                    onClick={() => addDownloadLinkToEpisode(ep.id)}
                                    className="flex items-center gap-1 text-red-500 text-xs hover:text-red-400"
                                  >
                                    <Plus className="w-3 h-3" />
                                    Add Link
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-white font-bold text-lg mb-2">Delete Series?</h3>
            <p className="text-gray-400 text-sm mb-4">
              Are you sure you want to delete "{title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
