import { useState } from 'react';
import { useCategories } from '@/admin/hooks/useCategories';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/admin/services/categoryService';



export default function CategoryManager() {
  const { categories, loading } = useCategories();

  // Local edits tracked per row
  const [edits, setEdits] = useState<Record<string, { name: string; description: string }>>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  // New category row
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [adding, setAdding] = useState(false);

  function getEditValue(id: string, field: 'name' | 'description', fallback: string): string {
    return edits[id]?.[field] ?? fallback;
  }

  function setEditValue(id: string, field: 'name' | 'description', value: string, original: { name: string; description: string }) {
    setEdits((prev) => ({
      ...prev,
      [id]: {
        name: field === 'name' ? value : prev[id]?.name ?? original.name,
        description: field === 'description' ? value : prev[id]?.description ?? original.description,
      },
    }));
  }

  function isDirty(id: string, cat: { name: string; description: string }): boolean {
    const edit = edits[id];
    if (!edit) return false;
    return edit.name !== cat.name || edit.description !== cat.description;
  }

  async function handleSave(id: string) {
    const edit = edits[id];
    if (!edit) return;

    setSavingIds((prev) => new Set(prev).add(id));
    try {
      await updateCategory(id, { name: edit.name, description: edit.description });
      // Clear local edit after save
      setEdits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (err) {
      console.error('Error saving category:', err);
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
      `¿Estás seguro de eliminar la categoría "${name}"? Los modelos asociados no serán eliminados.`
    );
    if (!confirmed) return;

    try {
      await deleteCategory(id);
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  }

  async function handleAdd() {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      await createCategory({
        name: newName.trim(),
        description: newDescription.trim(),
        order: categories.length,
      });
      setNewName('');
      setNewDescription('');
    } catch (err) {
      console.error('Error creating category:', err);
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Categorías</h2>
        <p className="text-sm text-gray-500 mt-1">
          Administra las categorías de tus modelos de motos.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[40px_1fr_1fr_auto] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div />
          <div>Nombre</div>
          <div>Descripción</div>
          <div className="w-[140px]">Acciones</div>
        </div>

        {/* Category rows */}
        {categories.map((cat) => {
          const isSaving = savingIds.has(cat.id);
          const dirty = isDirty(cat.id, cat);

          return (
            <div
              key={cat.id}
              className="grid grid-cols-[40px_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-gray-100 items-center last:border-b-0"
            >
              {/* Drag handle (visual placeholder for future reorder) */}
              <div className="flex items-center justify-center text-gray-300 cursor-grab">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                </svg>
              </div>

              {/* Name */}
              <input
                type="text"
                value={getEditValue(cat.id, 'name', cat.name)}
                onChange={(e) => setEditValue(cat.id, 'name', e.target.value, cat)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />

              {/* Description */}
              <input
                type="text"
                value={getEditValue(cat.id, 'description', cat.description)}
                onChange={(e) => setEditValue(cat.id, 'description', e.target.value, cat)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />

              {/* Actions */}
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
                  title="Eliminar categoría"
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
        <div className="grid grid-cols-[40px_1fr_1fr_auto] gap-4 px-5 py-3 bg-gray-50/50 items-center border-t border-gray-200">
          {/* Empty handle column */}
          <div className="flex items-center justify-center text-green-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>

          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nombre de la categoría"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />

          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Descripción (opcional)"
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
      </div>

      {/* Empty hint */}
      {categories.length === 0 && (
        <p className="text-center text-sm text-gray-400 mt-6">
          No hay categorías aún. Agrega la primera arriba.
        </p>
      )}
    </div>
  );
}
