import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModels } from '@/admin/hooks/useModels';
import { useCategories } from '@/admin/hooks/useCategories';
import { createModel } from '@/admin/services/modelService';

function SkeletonCard() {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-5 bg-gray-100 rounded-full w-16" />
          <div className="h-5 bg-gray-100 rounded-full w-12" />
        </div>
      </div>
    </div>
  );
}

export default function ModelList() {
  const { models, loading: modelsLoading } = useModels();
  const { categories, loading: catsLoading } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const loading = modelsLoading || catsLoading;

  const filteredModels =
    activeCategory === 'all'
      ? models
      : models.filter((m) => m.categoryId === activeCategory);

  function getCategoryName(categoryId: string): string {
    return categories.find((c) => c.id === categoryId)?.name ?? 'Sin categoría';
  }

  async function handleCreateModel() {
    setCreating(true);
    try {
      const id = await createModel({
        name: 'Nuevo Modelo',
        slug: 'nuevo-modelo',
        categoryId: categories[0]?.id ?? '',
        featured: false,
        description: '',
        specs: { engine: '', maxSpeed: '' },
        order: models.length,
      });
      navigate(`/admin/models/${id}`);
    } catch (err) {
      console.error('Error creating model:', err);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Catálogo de Modelos</h2>
          <p className="text-sm text-gray-500 mt-1">
            {models.length} modelo{models.length !== 1 ? 's' : ''} en total
          </p>
        </div>
        <button
          onClick={handleCreateModel}
          disabled={creating || loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Agregar Modelo
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
        {categories.map((cat) => (
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

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredModels.length === 0 && (
        <div className="text-center py-20">
          <svg className="mx-auto w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-600 mb-1">No hay modelos</h3>
          <p className="text-sm text-gray-400">
            {activeCategory === 'all'
              ? 'Agrega tu primer modelo para comenzar.'
              : 'No hay modelos en esta categoría.'}
          </p>
        </div>
      )}

      {/* Model cards grid */}
      {!loading && filteredModels.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModels.map((model) => {
            const thumbnail = model.colors[0]?.images?.main;
            return (
              <button
                key={model.id}
                onClick={() => navigate(`/admin/models/${model.id}`)}
                className="text-left border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md hover:border-gray-300 transition group"
              >
                {/* Thumbnail */}
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={model.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                      </svg>
                    </div>
                  )}
                  {/* Featured badge */}
                  {model.featured && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      Destacado
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {model.name}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {getCategoryName(model.categoryId)}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {model.colors.length} color{model.colors.length !== 1 ? 'es' : ''}
                    </span>
                  </div>
                  {(model.specs?.engine || model.specs?.maxSpeed) && (
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {model.specs.engine && <span>{model.specs.engine}</span>}
                      {model.specs.maxSpeed && <span>{model.specs.maxSpeed}</span>}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
