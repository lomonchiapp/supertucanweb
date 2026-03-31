import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useModel } from '@/admin/hooks/useModel';
import { useCategories } from '@/admin/hooks/useCategories';
import { updateModel, deleteModel } from '@/admin/services/modelService';
import {
  addColor,
  updateColor,
  deleteColor,
  ColorInput,
} from '@/admin/services/colorService';
import { uploadImage } from '@/admin/services/storageService';

/* ---------- helpers ---------- */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/* ---------- toast ---------- */

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white text-sm px-5 py-3 rounded-lg shadow-lg animate-[fadeIn_0.2s_ease]">
      <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      {message}
    </div>
  );
}

/* ---------- dropzone wrapper ---------- */

function ImageDropzone({
  label,
  onDrop,
  uploading,
}: {
  label: string;
  onDrop: (files: File[]) => void;
  uploading: boolean;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
        isDragActive
          ? 'border-red-400 bg-red-50'
          : 'border-gray-300 hover:border-gray-400 bg-gray-50'
      } ${uploading ? 'opacity-50 cursor-wait' : ''}`}
    >
      <input {...getInputProps()} />
      <svg className="mx-auto w-6 h-6 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>
      <p className="text-xs text-gray-500">
        {uploading ? 'Subiendo...' : label}
      </p>
    </div>
  );
}

/* ---------- image thumbnail ---------- */

function ImageThumb({
  src,
  onDelete,
}: {
  src: string;
  onDelete: () => void;
}) {
  return (
    <div className="relative group w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
      <img src={src} alt="" className="w-full h-full object-cover" />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs"
        title="Eliminar imagen"
      >
        &times;
      </button>
    </div>
  );
}

/* ---------- Color Editor Panel ---------- */

interface ColorEditorProps {
  color: {
    id: string;
    name: string;
    value: string;
    hex: string;
    images: { main: string; front: string; additional: string[] };
    order: number;
  };
  modelId: string;
  modelSlug: string;
  onSaved: () => void;
}

function ColorEditor({ color, modelId, modelSlug, onSaved }: ColorEditorProps) {
  const [name, setName] = useState(color.name);
  const [value, setValue] = useState(color.value);
  const [hex, setHex] = useState(color.hex);
  const [mainImg, setMainImg] = useState(color.images?.main ?? '');
  const [frontImg, setFrontImg] = useState(color.images?.front ?? '');
  const [additional, setAdditional] = useState<string[]>(color.images?.additional ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleUpload(file: File, type: 'main' | 'front' | 'gallery') {
    setUploading(true);
    try {
      const timestamp = Date.now();
      const filename =
        type === 'gallery'
          ? `gallery-${timestamp}-${file.name}`
          : `${type}.${file.name.split('.').pop()}`;
      const url = await uploadImage(modelSlug, value || color.value, file, filename);
      if (type === 'main') setMainImg(url);
      else if (type === 'front') setFrontImg(url);
      else setAdditional((prev) => [...prev, url]);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveColor() {
    setSaving(true);
    try {
      await updateColor(modelId, color.id, {
        name,
        value,
        hex,
        images: { main: mainImg, front: frontImg, additional },
      });
      onSaved();
    } catch (err) {
      console.error('Error saving color:', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Fields row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Valor (slug)</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Color (hex)</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Main image */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Imagen principal</label>
          {mainImg ? (
            <div className="flex items-start gap-3">
              <ImageThumb
                src={mainImg}
                onDelete={() => setMainImg('')}
              />
              <ImageDropzone
                label="Reemplazar"
                onDrop={(files) => files[0] && handleUpload(files[0], 'main')}
                uploading={uploading}
              />
            </div>
          ) : (
            <ImageDropzone
              label="Arrastra o haz clic para subir"
              onDrop={(files) => files[0] && handleUpload(files[0], 'main')}
              uploading={uploading}
            />
          )}
        </div>

        {/* Front image */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Imagen frontal</label>
          {frontImg ? (
            <div className="flex items-start gap-3">
              <ImageThumb
                src={frontImg}
                onDelete={() => setFrontImg('')}
              />
              <ImageDropzone
                label="Reemplazar"
                onDrop={(files) => files[0] && handleUpload(files[0], 'front')}
                uploading={uploading}
              />
            </div>
          ) : (
            <ImageDropzone
              label="Arrastra o haz clic para subir"
              onDrop={(files) => files[0] && handleUpload(files[0], 'front')}
              uploading={uploading}
            />
          )}
        </div>
      </div>

      {/* Gallery */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Galería</label>
        <div className="flex items-start gap-3 flex-wrap">
          {additional.map((url, idx) => (
            <ImageThumb
              key={idx}
              src={url}
              onDelete={() => setAdditional((prev) => prev.filter((_, i) => i !== idx))}
            />
          ))}
          <div className="w-24">
            <ImageDropzone
              label="Agregar"
              onDrop={(files) => files[0] && handleUpload(files[0], 'gallery')}
              uploading={uploading}
            />
          </div>
        </div>
      </div>

      {/* Save color button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveColor}
          disabled={saving}
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition"
        >
          {saving ? 'Guardando...' : 'Guardar color'}
        </button>
      </div>
    </div>
  );
}

/* ========== MAIN COMPONENT ========== */

export default function ModelEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { model, loading } = useModel(id);
  const { categories } = useCategories();

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [engine, setEngine] = useState('');
  const [maxSpeed, setMaxSpeed] = useState('');
  const [featured, setFeatured] = useState(false);
  const [slugManual, setSlugManual] = useState(false);

  // UI state
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState('');
  const [expandedColor, setExpandedColor] = useState<string | null>(null);
  const [addingColor, setAddingColor] = useState(false);

  // Sync form state when model loads
  useEffect(() => {
    if (model) {
      setName(model.name);
      setSlug(model.slug);
      setCategoryId(model.categoryId);
      setDescription(model.description ?? '');
      setEngine(model.specs?.engine ?? '');
      setMaxSpeed(model.specs?.maxSpeed ?? '');
      setFeatured(model.featured);
    }
  }, [model]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugManual) {
      setSlug(slugify(name));
    }
  }, [name, slugManual]);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  async function handleSave() {
    if (!id) return;
    setSaving(true);
    try {
      await updateModel(id, {
        name,
        slug,
        categoryId,
        description,
        featured,
        specs: { engine, maxSpeed },
      });
      showToast('Modelo guardado correctamente');
    } catch (err) {
      console.error('Error saving model:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!id) return;
    const confirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar este modelo? Esta acción no se puede deshacer.'
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteModel(id);
      navigate('/admin/models');
    } catch (err) {
      console.error('Error deleting model:', err);
      setDeleting(false);
    }
  }

  async function handleAddColor() {
    if (!id) return;
    setAddingColor(true);
    try {
      const newColor: ColorInput = {
        name: 'Nuevo Color',
        value: 'nuevo-color',
        hex: '#000000',
        order: model?.colors.length ?? 0,
        images: { main: '', front: '', additional: [] },
      };
      const colorId = await addColor(id, newColor);
      setExpandedColor(colorId);
      showToast('Color agregado');
    } catch (err) {
      console.error('Error adding color:', err);
    } finally {
      setAddingColor(false);
    }
  }

  async function handleDeleteColor(colorId: string) {
    if (!id) return;
    const confirmed = window.confirm('¿Eliminar este color?');
    if (!confirmed) return;
    try {
      await deleteColor(id, colorId);
      if (expandedColor === colorId) setExpandedColor(null);
      showToast('Color eliminado');
    } catch (err) {
      console.error('Error deleting color:', err);
    }
  }

  /* ---------- Loading ---------- */

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-10 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-10 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-medium text-gray-600">Modelo no encontrado</h2>
        <button
          onClick={() => navigate('/admin/models')}
          className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Volver a Modelos
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/models')}
            className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500"
            title="Volver"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{model.name}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 text-sm font-medium rounded-lg transition"
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Model form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-5">
          Información del modelo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlugManual(false);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugManual(true);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoría</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                role="switch"
                aria-checked={featured}
                onClick={() => setFeatured(!featured)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  featured ? 'bg-red-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    featured ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-gray-700">Modelo destacado</span>
            </label>
          </div>

          {/* Engine */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Motor</label>
            <input
              type="text"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              placeholder="Ej: 150cc"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Max Speed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Velocidad máxima</label>
            <input
              type="text"
              value={maxSpeed}
              onChange={(e) => setMaxSpeed(e.target.value)}
              placeholder="Ej: 120 km/h"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Description - full width */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      {/* Colors section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
            Colores ({model.colors.length})
          </h3>
          <button
            onClick={handleAddColor}
            disabled={addingColor}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-medium rounded-lg transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Agregar Color
          </button>
        </div>

        {model.colors.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">
            Aún no hay colores. Agrega el primero.
          </p>
        )}

        <div className="space-y-3">
          {model.colors.map((color) => {
            const isExpanded = expandedColor === color.id;
            return (
              <div
                key={color.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Color header row */}
                <div className="flex items-center gap-4 px-4 py-3 bg-gray-50">
                  {/* Color swatch */}
                  <div
                    className="w-8 h-8 rounded-full border border-gray-300 shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  {/* Name */}
                  <span className="text-sm font-medium text-gray-800 flex-1">
                    {color.name}
                  </span>
                  {/* Thumbnail */}
                  {color.images?.main && (
                    <img
                      src={color.images.main}
                      alt={color.name}
                      className="w-10 h-10 rounded object-cover border border-gray-200"
                    />
                  )}
                  {/* Buttons */}
                  <button
                    onClick={() =>
                      setExpandedColor(isExpanded ? null : color.id)
                    }
                    className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-white transition text-gray-600"
                  >
                    {isExpanded ? 'Cerrar' : 'Editar'}
                  </button>
                  <button
                    onClick={() => handleDeleteColor(color.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition"
                    title="Eliminar color"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>

                {/* Expanded color editor */}
                {isExpanded && (
                  <div className="px-4 py-5 border-t border-gray-200">
                    <ColorEditor
                      color={color}
                      modelId={id!}
                      modelSlug={slug}
                      onSaved={() => showToast('Color guardado')}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
