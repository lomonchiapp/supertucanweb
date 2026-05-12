import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModels } from '@/admin/hooks/useModels';
import { useCategories } from '@/admin/hooks/useCategories';
import { createModel } from '@/admin/services/modelService';
import type { Model } from '@/admin/services/modelService';

type ViewMode = 'grid' | 'list' | 'compact';

const VIEW_STORAGE_KEY = 'admin-models-view';

function getInitialView(): ViewMode {
  if (typeof window === 'undefined') return 'list';
  const stored = localStorage.getItem(VIEW_STORAGE_KEY);
  if (stored === 'grid' || stored === 'list' || stored === 'compact') return stored;
  // Mobile-first default: list en pantallas pequeñas, grid en desktop
  return window.matchMedia('(min-width: 1024px)').matches ? 'grid' : 'list';
}

/* ─────────────────────────────────────────────────────────── */
/* Thumbnail con fallback automático cuando la imagen falla     */
/* ─────────────────────────────────────────────────────────── */
function Thumbnail({
  src,
  alt,
  className = '',
  iconSize = 'w-8 h-8',
}: {
  src?: string;
  alt: string;
  className?: string;
  iconSize?: string;
}) {
  const [failed, setFailed] = useState(false);
  const hasImage = src && !failed;

  return (
    <div className={`bg-gray-100 flex items-center justify-center overflow-hidden ${className}`}>
      {hasImage ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="w-full h-full object-contain"
        />
      ) : (
        <svg className={`${iconSize} text-gray-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
        </svg>
      )}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 animate-pulse">
      <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */

export default function ModelList() {
  const { models, loading: modelsLoading } = useModels();
  const { categories, loading: catsLoading } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [creating, setCreating] = useState(false);
  const [view, setView] = useState<ViewMode>(getInitialView);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(VIEW_STORAGE_KEY, view);
  }, [view]);

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
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="min-w-0">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Modelos</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {models.length} {models.length !== 1 ? 'modelos' : 'modelo'}
          </p>
        </div>
        <button
          onClick={handleCreateModel}
          disabled={creating || loading}
          className="shrink-0 inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-lg transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="hidden sm:inline">Agregar Modelo</span>
          <span className="sm:hidden">Nuevo</span>
        </button>
      </div>

      {/* Controls: category tabs + view switcher */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 flex-1 overflow-x-auto pb-1 -mx-1 px-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={`shrink-0 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition ${
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
              className={`shrink-0 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition uppercase ${
                activeCategory === cat.id
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* View mode switcher (oculto en xs) */}
        <div className="hidden sm:flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg p-0.5 shrink-0">
          <ViewButton mode="grid" current={view} onClick={() => setView('grid')} label="Grilla">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
          </ViewButton>
          <ViewButton mode="list" current={view} onClick={() => setView('list')} label="Lista">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </ViewButton>
          <ViewButton mode="compact" current={view} onClick={() => setView('compact')} label="Compacta">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            </svg>
          </ViewButton>
        </div>

        {/* Mobile: solo grid/list, sin compacta */}
        <div className="flex sm:hidden items-center gap-0.5 bg-white border border-gray-200 rounded-lg p-0.5 shrink-0">
          <ViewButton mode="grid" current={view} onClick={() => setView('grid')} label="Grilla">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
          </ViewButton>
          <ViewButton mode="list" current={view} onClick={() => setView('list')} label="Lista">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </ViewButton>
        </div>
      </div>

      {/* Loading */}
      {loading &&
        (view === 'grid' ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <GridSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <ListSkeleton key={i} />
            ))}
          </div>
        ))}

      {/* Empty */}
      {!loading && filteredModels.length === 0 && (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
          <svg className="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <h3 className="text-base font-medium text-gray-600 mb-1">No hay modelos</h3>
          <p className="text-sm text-gray-400">
            {activeCategory === 'all' ? 'Agrega tu primer modelo para comenzar.' : 'No hay modelos en esta categoría.'}
          </p>
        </div>
      )}

      {/* Content */}
      {!loading && filteredModels.length > 0 && (
        <>
          {view === 'grid' && (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-5">
              {filteredModels.map((model) => (
                <GridCard
                  key={model.id}
                  model={model}
                  categoryName={getCategoryName(model.categoryId)}
                  onClick={() => navigate(`/admin/models/${model.id}`)}
                />
              ))}
            </div>
          )}

          {view === 'list' && (
            <div className="space-y-2">
              {filteredModels.map((model) => (
                <ListRow
                  key={model.id}
                  model={model}
                  categoryName={getCategoryName(model.categoryId)}
                  onClick={() => navigate(`/admin/models/${model.id}`)}
                />
              ))}
            </div>
          )}

          {view === 'compact' && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="hidden md:grid grid-cols-[2fr_1fr_120px_120px_60px] gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div>Modelo</div>
                <div>Categoría</div>
                <div>Colores</div>
                <div>Specs</div>
                <div></div>
              </div>
              {filteredModels.map((model) => (
                <CompactRow
                  key={model.id}
                  model={model}
                  categoryName={getCategoryName(model.categoryId)}
                  onClick={() => navigate(`/admin/models/${model.id}`)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */

function ViewButton({
  mode,
  current,
  onClick,
  label,
  children,
}: {
  mode: ViewMode;
  current: ViewMode;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  const active = mode === current;
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`w-8 h-8 rounded-md flex items-center justify-center transition ${
        active ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────── */

function GridCard({
  model,
  categoryName,
  onClick,
}: {
  model: Model;
  categoryName: string;
  onClick: () => void;
}) {
  const thumbnail = model.colors[0]?.images?.main;
  return (
    <button
      onClick={onClick}
      className="text-left border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md hover:border-gray-300 transition group"
    >
      <Thumbnail src={thumbnail} alt={model.name} className="aspect-[4/3] relative" iconSize="w-10 h-10" />
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-gray-900 truncate text-sm">{model.name}</h3>
          {model.featured && (
            <span className="shrink-0 bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
              ★
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase tracking-wide">
            {categoryName}
          </span>
          <span className="text-[10px] text-gray-400">
            {model.colors.length} color{model.colors.length !== 1 ? 'es' : ''}
          </span>
        </div>
        {(model.specs?.engine || model.specs?.maxSpeed) && (
          <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1.5">
            {model.specs.engine && <span>{model.specs.engine}</span>}
            {model.specs.maxSpeed && <span>· {model.specs.maxSpeed}</span>}
          </div>
        )}
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────── */

function ListRow({
  model,
  categoryName,
  onClick,
}: {
  model: Model;
  categoryName: string;
  onClick: () => void;
}) {
  const thumbnail = model.colors[0]?.images?.main;
  return (
    <button
      onClick={onClick}
      className="w-full text-left border border-gray-200 rounded-lg p-3 flex items-center gap-3 bg-white hover:shadow-sm hover:border-gray-300 transition group"
    >
      <Thumbnail
        src={thumbnail}
        alt={model.name}
        className="w-16 h-16 rounded-lg shrink-0"
        iconSize="w-6 h-6"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 truncate text-sm">{model.name}</h3>
          {model.featured && (
            <span className="shrink-0 bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
              Destacado
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500">
          <span className="font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase tracking-wide text-[10px]">
            {categoryName}
          </span>
          <span>·</span>
          <span>{model.colors.length} color{model.colors.length !== 1 ? 'es' : ''}</span>
          {model.specs?.engine && (
            <>
              <span>·</span>
              <span>{model.specs.engine}</span>
            </>
          )}
          {model.specs?.maxSpeed && (
            <>
              <span>·</span>
              <span>{model.specs.maxSpeed}</span>
            </>
          )}
        </div>
      </div>
      <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────── */

function CompactRow({
  model,
  categoryName,
  onClick,
}: {
  model: Model;
  categoryName: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left grid grid-cols-1 md:grid-cols-[2fr_1fr_120px_120px_60px] gap-3 px-4 py-2.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition items-center"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-medium text-gray-900 truncate text-sm">{model.name}</span>
        {model.featured && (
          <span className="shrink-0 text-amber-500 text-xs" title="Destacado">★</span>
        )}
      </div>
      <div className="text-xs text-gray-600 uppercase tracking-wide">{categoryName}</div>
      <div className="text-xs text-gray-500">
        {model.colors.length} color{model.colors.length !== 1 ? 'es' : ''}
      </div>
      <div className="text-xs text-gray-500 truncate">
        {[model.specs?.engine, model.specs?.maxSpeed].filter(Boolean).join(' · ')}
      </div>
      <div className="hidden md:flex justify-end">
        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
