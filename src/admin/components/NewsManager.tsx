import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Timestamp } from 'firebase/firestore';
import { useNews } from '@/admin/hooks/useNews';
import {
  createNews,
  updateNews,
  deleteNews,
  newsStoragePath,
  slugify,
  type NewsArticle,
  type NewsInput,
} from '@/admin/services/newsService';
import { uploadFileToPath } from '@/admin/services/storageService';

const TAG_OPTIONS = ['noticias', 'eventos', 'servicio', 'producto'];

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white text-sm px-5 py-3 rounded-lg shadow-lg">
      <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      {message}
    </div>
  );
}

function formatDate(value: Timestamp | null | undefined): string {
  if (!value) return '—';
  const d = value.toDate();
  return d.toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' });
}

function dateInputValue(value: Timestamp | null | undefined): string {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value.toDate().toISOString().slice(0, 10);
}

export default function NewsManager() {
  const { news, loading } = useNews();
  const [modalArticle, setModalArticle] = useState<NewsArticle | 'new' | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const handleDelete = async (article: NewsArticle) => {
    if (!confirm(`¿Eliminar "${article.title}"?`)) return;
    setDeleting(article.id);
    try {
      await deleteNews(article.id, article.image || undefined);
      setToast('Noticia eliminada');
    } finally {
      setDeleting(null);
    }
  };

  const togglePublished = async (article: NewsArticle) => {
    await updateNews(article.id, { published: !article.published });
    setToast(article.published ? 'Despublicada' : 'Publicada');
  };

  return (
    <div className="max-w-[1200px]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Noticias</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {news.length} {news.length === 1 ? 'artículo' : 'artículos'}
          </p>
        </div>
        <button
          onClick={() => setModalArticle('new')}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva noticia
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500">
          Cargando…
        </div>
      ) : news.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
          </svg>
          <p className="text-gray-500 text-sm">Aún no hay noticias publicadas.</p>
          <button
            onClick={() => setModalArticle('new')}
            className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Crear la primera →
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Desktop: table-like grid */}
          <div className="hidden md:grid grid-cols-[80px_2fr_1fr_120px_140px_120px] gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div>Imagen</div>
            <div>Título</div>
            <div>Tag</div>
            <div>Estado</div>
            <div>Publicada</div>
            <div className="text-right">Acciones</div>
          </div>

          {news.map((article) => (
            <div
              key={article.id}
              className="grid grid-cols-[64px_1fr] md:grid-cols-[80px_2fr_1fr_120px_140px_120px] gap-3 px-3 md:px-5 py-3 border-b border-gray-100 last:border-b-0 items-center hover:bg-gray-50 transition"
            >
              {/* Image */}
              <div className="w-16 h-16 md:w-14 md:h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                {article.image ? (
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Title + slug + mobile-only meta */}
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{article.title}</p>
                <p className="text-xs text-gray-500 truncate">/{article.slug}</p>
                <div className="md:hidden flex flex-wrap items-center gap-2 mt-1.5 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium uppercase tracking-wide">
                    {article.tag}
                  </span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500">{formatDate(article.publishedAt)}</span>
                </div>
              </div>

              {/* Desktop columns */}
              <div className="hidden md:block">
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium uppercase tracking-wide">
                  {article.tag}
                </span>
              </div>
              <div className="hidden md:flex items-center">
                <button
                  onClick={() => togglePublished(article)}
                  className={`relative w-10 h-6 rounded-full transition ${
                    article.published ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  aria-label={article.published ? 'Despublicar' : 'Publicar'}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      article.published ? 'translate-x-4' : ''
                    }`}
                  />
                </button>
                <span className="ml-2 text-xs text-gray-600">
                  {article.published ? 'Visible' : 'Borrador'}
                </span>
              </div>
              <div className="hidden md:block text-sm text-gray-600">
                {formatDate(article.publishedAt)}
              </div>

              {/* Actions */}
              <div className="hidden md:flex items-center justify-end gap-1">
                <button
                  onClick={() => setModalArticle(article)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition"
                  aria-label="Editar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(article)}
                  disabled={deleting === article.id}
                  className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-500 hover:text-red-600 transition disabled:opacity-50"
                  aria-label="Eliminar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>

              {/* Mobile actions row */}
              <div className="md:hidden col-span-2 flex items-center justify-between gap-2 pt-2 border-t border-gray-100 mt-1">
                <button
                  onClick={() => togglePublished(article)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full transition ${
                    article.published
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {article.published ? '● Visible' : '○ Borrador'}
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => setModalArticle(article)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(article)}
                    disabled={deleting === article.id}
                    className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalArticle !== null && (
        <NewsModal
          initial={modalArticle === 'new' ? null : modalArticle}
          onClose={() => setModalArticle(null)}
          onSaved={(msg) => {
            setModalArticle(null);
            setToast(msg);
          }}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* MODAL: crear / editar noticia                                */
/* ─────────────────────────────────────────────────────────── */

function NewsModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: NewsArticle | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const isEdit = !!initial;
  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [tag, setTag] = useState(initial?.tag ?? 'noticias');
  const [image, setImage] = useState(initial?.image ?? '');
  const [published, setPublished] = useState(initial?.published ?? true);
  const [publishedAt, setPublishedAt] = useState(dateInputValue(initial?.publishedAt));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Auto-genera slug a partir del título (solo si no estamos editando)
  useEffect(() => {
    if (!isEdit && title && !slug) {
      setSlug(slugify(title));
    }
  }, [title, isEdit, slug]);

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      setUploading(true);
      try {
        const slugForPath = slug || slugify(title) || `news-${Date.now()}`;
        const ext = file.name.split('.').pop() ?? 'jpg';
        const path = newsStoragePath(slugForPath, `cover-${Date.now()}.${ext}`);
        const url = await uploadFileToPath(path, file);
        setImage(url);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al subir imagen');
      } finally {
        setUploading(false);
      }
    },
    [slug, title]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    disabled: uploading,
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    setError('');
    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }
    if (!slug.trim()) {
      setError('El slug es obligatorio');
      return;
    }
    if (!excerpt.trim()) {
      setError('El extracto es obligatorio');
      return;
    }

    setSaving(true);
    try {
      const dateValue = publishedAt
        ? Timestamp.fromDate(new Date(publishedAt))
        : Timestamp.now();

      const payload: NewsInput = {
        title: title.trim(),
        slug: slugify(slug),
        excerpt: excerpt.trim(),
        content: content.trim(),
        tag,
        image,
        published,
        publishedAt: dateValue,
      };

      if (isEdit && initial) {
        await updateNews(initial.id, payload);
        onSaved('Noticia actualizada');
      } else {
        await createNews(payload);
        onSaved('Noticia creada');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start lg:items-center justify-center bg-black/50 overflow-y-auto p-3 lg:p-6">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl my-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 lg:px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 className="font-bold text-gray-900">{isEdit ? 'Editar noticia' : 'Nueva noticia'}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 lg:px-6 py-5 space-y-4">
          {/* Imagen */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Imagen de portada
            </label>
            {image ? (
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img src={image} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => setImage('')}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow"
                  aria-label="Quitar imagen"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                  isDragActive ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                } ${uploading ? 'opacity-50 cursor-wait' : ''}`}
              >
                <input {...getInputProps()} />
                <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                <p className="text-sm text-gray-600">
                  {uploading ? 'Subiendo…' : 'Suelta una imagen aquí o haz clic'}
                </p>
              </div>
            )}
          </div>

          {/* Título + slug */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Título</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Super Tucán anuncia…"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Slug</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="super-tucan-anuncia"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-red-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Tag + fecha */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Tag</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-red-500 focus:outline-none bg-white"
              >
                {TAG_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                Fecha de publicación
              </label>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Extracto */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
              Extracto <span className="text-gray-400 normal-case">(resumen breve)</span>
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Un resumen corto que aparece en las tarjetas…"
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-red-500 focus:outline-none resize-none"
            />
          </div>

          {/* Contenido */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
              Contenido completo
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="El cuerpo del artículo. Usa líneas en blanco para separar párrafos."
              rows={8}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-red-500 focus:outline-none resize-y"
            />
          </div>

          {/* Published toggle */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setPublished(!published)}
              className={`relative w-11 h-6 rounded-full transition ${
                published ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  published ? 'translate-x-5' : ''
                }`}
              />
            </button>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {published ? 'Publicada' : 'Borrador'}
              </p>
              <p className="text-xs text-gray-500">
                {published ? 'Visible en el sitio.' : 'Solo visible en el admin.'}
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 lg:px-6 py-4 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || uploading}
            className="px-5 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
          >
            {saving ? 'Guardando…' : isEdit ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
}
