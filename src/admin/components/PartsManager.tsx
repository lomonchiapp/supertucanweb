import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParts, usePartsCategories } from '@/admin/hooks/useParts';
import { useModels } from '@/admin/hooks/useModels';
import { useCategories } from '@/admin/hooks/useCategories';
import {
  createPart,
  updatePart,
  deletePart,
  createPartCategory,
  updatePartCategory,
  deletePartCategory,
} from '@/admin/services/partsService';
import type { Part, PartInput, PartCategory } from '@/admin/services/partsService';
import { uploadFileToPath } from '@/admin/services/storageService';

/* ---------- Toast ---------- */

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

/* ---------- Image Dropzone ---------- */

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
    maxFiles: 1,
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

/* ---------- Compatible Models Multi-Select ---------- */

function CompatibleModelsSelect({
  selectedIds,
  onChange,
}: {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const { models, loading } = useModels();
  const { categories } = useCategories();
  const [open, setOpen] = useState(false);

  // Group models by category
  const grouped = categories.map((cat) => ({
    category: cat,
    models: models.filter((m) => m.categoryId === cat.id),
  })).filter((g) => g.models.length > 0);

  // Models without a category
  const uncategorized = models.filter(
    (m) => !categories.some((c) => c.id === m.categoryId)
  );

  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((s) => s !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  function getModelName(id: string): string {
    return models.find((m) => m.id === id)?.name ?? id;
  }

  if (loading) {
    return <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />;
  }

  return (
    <div className="relative">
      {/* Selected pills */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selectedIds.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {getModelName(id)}
              <button
                type="button"
                onClick={() => toggle(id)}
                className="hover:text-red-900 transition"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-left focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white flex items-center justify-between"
      >
        <span className="text-gray-500">
          {selectedIds.length === 0
            ? 'Seleccionar modelos compatibles...'
            : `${selectedIds.length} modelo${selectedIds.length !== 1 ? 's' : ''} seleccionado${selectedIds.length !== 1 ? 's' : ''}`}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {models.length === 0 && (
            <p className="p-3 text-sm text-gray-400">No hay modelos disponibles.</p>
          )}

          {grouped.map(({ category, models: catModels }) => (
            <div key={category.id}>
              <div className="px-3 py-1.5 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider sticky top-0">
                {category.name}
              </div>
              {catModels.map((model) => (
                <label
                  key={model.id}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(model.id)}
                    onChange={() => toggle(model.id)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{model.name}</span>
                </label>
              ))}
            </div>
          ))}

          {uncategorized.length > 0 && (
            <div>
              <div className="px-3 py-1.5 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider sticky top-0">
                Sin categoria
              </div>
              {uncategorized.map((model) => (
                <label
                  key={model.id}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(model.id)}
                    onChange={() => toggle(model.id)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{model.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Part Form Modal ---------- */

interface PartFormProps {
  part?: Part | null;
  partsCategories: PartCategory[];
  partsCount: number;
  onClose: () => void;
  onSaved: (msg: string) => void;
}

function PartForm({ part, partsCategories, partsCount, onClose, onSaved }: PartFormProps) {
  const isEdit = !!part;

  const [name, setName] = useState(part?.name ?? '');
  const [categoryId, setCategoryId] = useState(part?.categoryId ?? (partsCategories[0]?.id ?? ''));
  const [description, setDescription] = useState(part?.description ?? '');
  const [price, setPrice] = useState<number>(part?.price ?? 0);
  const [originalPrice, setOriginalPrice] = useState<number | ''>(part?.originalPrice ?? '');
  const [inStock, setInStock] = useState(part?.inStock ?? true);
  const [compatibleModels, setCompatibleModels] = useState<string[]>(part?.compatibleModels ?? []);
  const [imageUrl, setImageUrl] = useState(part?.image ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Calculate discount
  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  function handleImageDrop(files: File[]) {
    const file = files[0];
    if (!file) return;
    setImageFile(file);
    // Show local preview
    setImageUrl(URL.createObjectURL(file));
  }

  async function handleSubmit() {
    if (!name.trim()) return;
    setSaving(true);

    try {
      let finalImage = part?.image ?? '';

      // Upload image if a new file was chosen
      if (imageFile) {
        setUploading(true);
        // For new parts, use a temp id, then update; for existing parts, use the part id
        const partId = part?.id ?? `temp-${Date.now()}`;
        const ext = imageFile.name.split('.').pop() ?? 'jpg';
        const storagePath = `parts/${partId}/image.${ext}`;
        finalImage = await uploadFileToPath(storagePath, imageFile);
        setUploading(false);
      } else if (!imageUrl) {
        finalImage = '';
      }

      const data: PartInput = {
        name: name.trim(),
        categoryId,
        description: description.trim(),
        price,
        originalPrice: originalPrice === '' ? null : originalPrice,
        discount,
        inStock,
        compatibleModels,
        image: finalImage,
        order: part?.order ?? partsCount,
      };

      if (isEdit && part) {
        await updatePart(part.id, data);
        onSaved('Repuesto actualizado');
      } else {
        const newId = await createPart(data);
        // If we used a temp path for image, re-upload to proper path
        if (imageFile && !part) {
          const ext = imageFile.name.split('.').pop() ?? 'jpg';
          const properPath = `parts/${newId}/image.${ext}`;
          const properUrl = await uploadFileToPath(properPath, imageFile);
          await updatePart(newId, { image: properUrl });
        }
        onSaved('Repuesto creado');
      }

      onClose();
    } catch (err) {
      console.error('Error saving part:', err);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Editar Repuesto' : 'Agregar Repuesto'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal body */}
        <div className="px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del repuesto"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoria</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Seleccionar categoria</option>
              {partsCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripcion</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Descripcion del repuesto"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Price & Original Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Precio</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min={0}
                step={0.01}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Precio Original</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) =>
                  setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))
                }
                min={0}
                step={0.01}
                placeholder="Opcional"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Descuento</label>
              <div className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500">
                {discount > 0 ? `${discount}%` : '--'}
              </div>
            </div>
          </div>

          {/* In Stock toggle */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                role="switch"
                aria-checked={inStock}
                onClick={() => setInStock(!inStock)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  inStock ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    inStock ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-gray-700">En Stock</span>
            </label>
          </div>

          {/* Compatible Models */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Modelos Compatibles
            </label>
            <CompatibleModelsSelect
              selectedIds={compatibleModels}
              onChange={setCompatibleModels}
            />
            <p className="mt-1 text-xs text-gray-400">
              Solo se pueden asignar modelos que existen en el catalogo.
            </p>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Imagen</label>
            {imageUrl ? (
              <div className="flex items-start gap-4">
                <div className="relative group w-28 h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                  <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('');
                      setImageFile(null);
                    }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs"
                  >
                    &times;
                  </button>
                </div>
                <div className="flex-1">
                  <ImageDropzone
                    label="Reemplazar imagen"
                    onDrop={handleImageDrop}
                    uploading={uploading}
                  />
                </div>
              </div>
            ) : (
              <ImageDropzone
                label="Arrastra o haz clic para subir"
                onDrop={handleImageDrop}
                uploading={uploading}
              />
            )}
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm font-medium rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !name.trim()}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {saving ? (uploading ? 'Subiendo imagen...' : 'Guardando...') : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Category Management Section ---------- */

function PartsCategorySection({
  categories,
  onSaved,
}: {
  categories: PartCategory[];
  onSaved: (msg: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [edits, setEdits] = useState<Record<string, { name: string; icon: string }>>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('');
  const [adding, setAdding] = useState(false);

  function getEditValue(id: string, field: 'name' | 'icon', fallback: string): string {
    return edits[id]?.[field] ?? fallback;
  }

  function setEditValue(
    id: string,
    field: 'name' | 'icon',
    value: string,
    original: { name: string; icon: string }
  ) {
    setEdits((prev) => ({
      ...prev,
      [id]: {
        name: field === 'name' ? value : prev[id]?.name ?? original.name,
        icon: field === 'icon' ? value : prev[id]?.icon ?? original.icon,
      },
    }));
  }

  function isDirty(id: string, cat: { name: string; icon: string }): boolean {
    const edit = edits[id];
    if (!edit) return false;
    return edit.name !== cat.name || edit.icon !== cat.icon;
  }

  async function handleSave(id: string) {
    const edit = edits[id];
    if (!edit) return;

    setSavingIds((prev) => new Set(prev).add(id));
    try {
      await updatePartCategory(id, { name: edit.name, icon: edit.icon });
      setEdits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      onSaved('Categoria actualizada');
    } catch (err) {
      console.error('Error saving part category:', err);
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  async function handleDelete(id: string, name: string) {
    const confirmed = window.confirm(
      `Estas seguro de eliminar la categoria de repuestos "${name}"?`
    );
    if (!confirmed) return;

    try {
      await deletePartCategory(id);
      onSaved('Categoria eliminada');
    } catch (err) {
      console.error('Error deleting part category:', err);
    }
  }

  async function handleAdd() {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      await createPartCategory({
        name: newName.trim(),
        icon: newIcon.trim(),
        order: categories.length,
      });
      setNewName('');
      setNewIcon('');
      onSaved('Categoria creada');
    } catch (err) {
      console.error('Error creating part category:', err);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="mt-10">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition"
      >
        <svg
          className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        Categorias de Repuestos ({categories.length})
      </button>

      {expanded && (
        <div className="mt-4 bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_1fr_auto] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div>Nombre</div>
            <div>Icono (SVG path)</div>
            <div className="w-[140px]">Acciones</div>
          </div>

          {/* Category rows */}
          {categories.map((cat) => {
            const isSaving = savingIds.has(cat.id);
            const dirty = isDirty(cat.id, cat);

            return (
              <div
                key={cat.id}
                className="grid grid-cols-[1fr_1fr_auto] gap-4 px-5 py-3 border-b border-gray-100 items-center last:border-b-0"
              >
                <input
                  type="text"
                  value={getEditValue(cat.id, 'name', cat.name)}
                  onChange={(e) => setEditValue(cat.id, 'name', e.target.value, cat)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={getEditValue(cat.id, 'icon', cat.icon)}
                  onChange={(e) => setEditValue(cat.id, 'icon', e.target.value, cat)}
                  placeholder="SVG path data"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <div className="flex items-center gap-2 w-[140px] justify-end">
                  <button
                    onClick={() => handleSave(cat.id)}
                    disabled={!dirty || isSaving}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                      dirty
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isSaving ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition"
                    title="Eliminar categoria"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add new category row */}
          <div className="grid grid-cols-[1fr_1fr_auto] gap-4 px-5 py-3 bg-gray-50/50 items-center border-t border-gray-200">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nombre de la categoria"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <input
              type="text"
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              placeholder="SVG path data (opcional)"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <div className="w-[140px] flex justify-end">
              <button
                onClick={handleAdd}
                disabled={!newName.trim() || adding}
                className="px-3 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-lg transition"
              >
                {adding ? 'Agregando...' : 'Agregar'}
              </button>
            </div>
          </div>

          {categories.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-6">
              No hay categorias de repuestos. Agrega la primera arriba.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ========== MAIN COMPONENT ========== */

export default function PartsManager() {
  const { parts, loading: partsLoading } = useParts();
  const { categories: partsCategories, loading: catLoading } = usePartsCategories();
  const { models } = useModels();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [modalPart, setModalPart] = useState<Part | null | 'new'>(null);
  const [toast, setToast] = useState('');

  const loading = partsLoading || catLoading;

  const filteredParts =
    activeCategory === 'all'
      ? parts
      : parts.filter((p) => p.categoryId === activeCategory);

  function getCategoryName(categoryId: string): string {
    return partsCategories.find((c) => c.id === categoryId)?.name ?? 'Sin categoria';
  }

  function getModelName(modelId: string): string {
    return models.find((m) => m.id === modelId)?.name ?? modelId;
  }

  async function handleDelete(part: Part) {
    const confirmed = window.confirm(
      `Estas seguro de eliminar el repuesto "${part.name}"? Esta accion no se puede deshacer.`
    );
    if (!confirmed) return;

    try {
      await deletePart(part.id);
      setToast('Repuesto eliminado');
    } catch (err) {
      console.error('Error deleting part:', err);
    }
  }

  const showToast = useCallback((msg: string) => setToast(msg), []);

  /* ---------- Loading ---------- */

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-10 bg-gray-200 rounded w-40" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 bg-gray-100 rounded-lg w-24" />
          ))}
        </div>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 border-b border-gray-100 px-5 py-3">
              <div className="h-4 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      {/* Modal */}
      {modalPart !== null && (
        <PartForm
          part={modalPart === 'new' ? null : modalPart}
          partsCategories={partsCategories}
          partsCount={parts.length}
          onClose={() => setModalPart(null)}
          onSaved={(msg) => {
            setModalPart(null);
            showToast(msg);
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Repuestos</h2>
          <p className="text-sm text-gray-500 mt-1">
            {parts.length} repuesto{parts.length !== 1 ? 's' : ''} en total
          </p>
        </div>
        <button
          onClick={() => setModalPart('new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Agregar Repuesto
        </button>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition ${
            activeCategory === 'all'
              ? 'bg-red-600 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Todos
        </button>
        {partsCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition ${
              activeCategory === cat.id
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filteredParts.length === 0 && (
        <div className="text-center py-20">
          <svg className="mx-auto w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.025 1.193-.14 1.743" />
          </svg>
          <h3 className="text-lg font-medium text-gray-600 mb-1">No hay repuestos</h3>
          <p className="text-sm text-gray-400">
            {activeCategory === 'all'
              ? 'Agrega tu primer repuesto para comenzar.'
              : 'No hay repuestos en esta categoria.'}
          </p>
        </div>
      )}

      {/* Parts table */}
      {filteredParts.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[48px_1fr_120px_1fr_100px_80px_100px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div />
            <div>Nombre</div>
            <div>Categoria</div>
            <div>Modelos Compatibles</div>
            <div>Precio</div>
            <div>Stock</div>
            <div className="text-right">Acciones</div>
          </div>

          {/* Rows */}
          {filteredParts.map((part) => (
            <div
              key={part.id}
              className="grid grid-cols-1 md:grid-cols-[48px_1fr_120px_1fr_100px_80px_100px] gap-4 px-5 py-3 border-b border-gray-100 items-center last:border-b-0 hover:bg-gray-50 transition"
            >
              {/* Image thumbnail */}
              <div className="hidden md:block">
                {part.image ? (
                  <img
                    src={part.image}
                    alt={part.name}
                    className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <p className="text-sm font-medium text-gray-900 truncate">{part.name}</p>
                {part.description && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">{part.description}</p>
                )}
              </div>

              {/* Category badge */}
              <div>
                <span className="inline-block text-[11px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full truncate max-w-full">
                  {getCategoryName(part.categoryId)}
                </span>
              </div>

              {/* Compatible models */}
              <div className="flex flex-wrap gap-1">
                {part.compatibleModels.length === 0 && (
                  <span className="text-xs text-gray-400">--</span>
                )}
                {part.compatibleModels.slice(0, 3).map((modelId) => (
                  <span
                    key={modelId}
                    className="inline-block text-[10px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                  >
                    {getModelName(modelId)}
                  </span>
                ))}
                {part.compatibleModels.length > 3 && (
                  <span className="inline-block text-[10px] font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    +{part.compatibleModels.length - 3}
                  </span>
                )}
              </div>

              {/* Price */}
              <div>
                <span className="text-sm font-medium text-gray-900">
                  ${part.price.toLocaleString()}
                </span>
                {part.discount > 0 && (
                  <span className="ml-1 text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                    -{part.discount}%
                  </span>
                )}
              </div>

              {/* Stock status */}
              <div>
                <span
                  className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    part.inStock
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {part.inStock ? 'En stock' : 'Agotado'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 justify-end">
                <button
                  onClick={() => setModalPart(part)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 transition"
                  title="Editar"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(part)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition"
                  title="Eliminar"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category management section */}
      <PartsCategorySection categories={partsCategories} onSaved={showToast} />
    </div>
  );
}
