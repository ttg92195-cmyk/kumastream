'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, Save, Loader2, Plus, X, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  duration: number;
  poster: string | null;
  backdrop: string | null;
  description: string;
  review?: string;
  genres: string;
  quality4k: boolean;
  director?: string;
  fileSize?: string;
  quality?: string;
  format?: string;
  subtitle?: string;
  imdbRating?: number;
  rtRating?: number;
  downloadLinks?: Array<{ quality: string; link: string }>;
  casts?: Array<{ id: string; name: string; role: string; photo?: string | null }>;
}

export default function EditMoviePage() {
  const { admin } = useAppStore();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(2024);
  const [rating, setRating] = useState(0);
  const [duration, setDuration] = useState(0);
  const [poster, setPoster] = useState('');
  const [backdrop, setBackdrop] = useState('');
  const [description, setDescription] = useState('');
  const [review, setReview] = useState('');
  const [genres, setGenres] = useState('');
  const [quality4k, setQuality4k] = useState(false);
  const [director, setDirector] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [quality, setQuality] = useState('');
  const [format, setFormat] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imdbRating, setImdbRating] = useState(0);
  const [rtRating, setRtRating] = useState(0);
  const [downloadLinks, setDownloadLinks] = useState<Array<{ quality: string; link: string }>>([]);

  useEffect(() => {
    if (!admin) {
      router.push('/admin/login');
      return;
    }

    // Fetch movie data
    fetch(`/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.movie) {
          const m = data.movie;
          setMovie(m);
          setTitle(m.title || '');
          setYear(m.year || 2024);
          setRating(m.rating || 0);
          setDuration(m.duration || 0);
          setPoster(m.poster || '');
          setBackdrop(m.backdrop || '');
          setDescription(m.description || '');
          setReview(m.review || '');
          setGenres(m.genres || '');
          setQuality4k(m.quality4k || false);
          setDirector(m.director || '');
          setFileSize(m.fileSize || '');
          setQuality(m.quality || '');
          setFormat(m.format || '');
          setSubtitle(m.subtitle || '');
          setImdbRating(m.imdbRating || 0);
          setRtRating(m.rtRating || 0);
          setDownloadLinks(m.downloadLinks || []);
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
      const response = await fetch(`/api/movies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          year,
          rating,
          duration,
          poster,
          backdrop,
          description,
          review,
          genres,
          quality4k,
          director,
          fileSize,
          quality,
          format,
          subtitle,
          imdbRating,
          rtRating,
          downloadLinks,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Movie updated successfully!');
        router.push('/admin/dashboard');
      } else {
        alert('Error: ' + (data.error || 'Failed to update movie'));
      }
    } catch (error) {
      console.error(error);
      alert('Failed to update movie');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('Movie deleted successfully!');
        router.push('/admin/dashboard');
      } else {
        alert('Error: ' + (data.error || 'Failed to delete movie'));
      }
    } catch (error) {
      console.error(error);
      alert('Failed to delete movie');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const addDownloadLink = () => {
    setDownloadLinks([...downloadLinks, { quality: '', link: '' }]);
  };

  const updateDownloadLink = (index: number, field: 'quality' | 'link', value: string) => {
    const newLinks = [...downloadLinks];
    newLinks[index][field] = value;
    setDownloadLinks(newLinks);
  };

  const removeDownloadLink = (index: number) => {
    setDownloadLinks(downloadLinks.filter((_, i) => i !== index));
  };

  if (!admin) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-gray-400">Movie not found</p>
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
            <h1 className="text-white font-bold text-lg">Edit Movie</h1>
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
            ⚠️ This is a static movie and cannot be edited. Only TMDB imported movies can be modified.
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
              <label className="text-gray-400 text-sm mb-1 block">Duration (min)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                disabled={!isEditable}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
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
            <div>
              <label className="text-gray-400 text-sm mb-1 block">IMDb Rating</label>
              <input
                type="number"
                step="0.1"
                value={imdbRating}
                onChange={(e) => setImdbRating(parseFloat(e.target.value) || 0)}
                disabled={!isEditable}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">RT Rating (%)</label>
              <input
                type="number"
                value={rtRating}
                onChange={(e) => setRtRating(parseInt(e.target.value) || 0)}
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

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Director</label>
            <input
              type="text"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              disabled={!isEditable}
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

        {/* Descriptions */}
        <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
          <h2 className="text-white font-semibold">Descriptions</h2>
          
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

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Review (Myanmar)</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              disabled={!isEditable}
              rows={4}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            />
          </div>
        </div>

        {/* File Info */}
        <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
          <h2 className="text-white font-semibold">File Information</h2>
          
          <div>
            <label className="text-gray-400 text-sm mb-1 block">File Size</label>
            <input
              type="text"
              value={fileSize}
              onChange={(e) => setFileSize(e.target.value)}
              disabled={!isEditable}
              placeholder="e.g., 7.7 GB / 3.4 GB / 1.5 GB"
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Quality</label>
            <input
              type="text"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              disabled={!isEditable}
              placeholder="e.g., Blu-Ray 4K HEVC / 1080p HEVC / 720p"
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Format</label>
            <input
              type="text"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              disabled={!isEditable}
              placeholder="e.g., MKV / MP4"
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              disabled={!isEditable}
              placeholder="e.g., Myanmar Subtitle (Hardsub)"
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Download Links */}
        <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold">Download Links</h2>
            {isEditable && (
              <button
                onClick={addDownloadLink}
                className="flex items-center gap-1 text-red-500 text-sm hover:text-red-400"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </button>
            )}
          </div>

          {downloadLinks.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No download links added yet</p>
          ) : (
            <div className="space-y-3">
              {downloadLinks.map((link, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={link.quality}
                      onChange={(e) => updateDownloadLink(index, 'quality', e.target.value)}
                      disabled={!isEditable}
                      placeholder="Quality (e.g., 4K, 1080p, 720p)"
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    />
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={link.link}
                        onChange={(e) => updateDownloadLink(index, 'link', e.target.value)}
                        disabled={!isEditable}
                        placeholder="Download URL"
                        className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                      />
                    </div>
                  </div>
                  {isEditable && (
                    <button
                      onClick={() => removeDownloadLink(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
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
            <h3 className="text-white font-bold text-lg mb-2">Delete Movie?</h3>
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
