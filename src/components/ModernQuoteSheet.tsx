import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { getModelsByCategory, getModelImage, type CategoryWithModels } from '@/utils/bikeSystem';
import type { BikeModel, BikeColor } from '@/types/bikes';

interface ModernQuoteSheetProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledBike?: BikeModel;
  prefilledColor?: BikeColor;
}

type QuoteFormData = {
  category: string;
  model: string;
  color: string;
  name: string;
  phone: string;
  email: string;
  city: string;
};

const emptyForm: QuoteFormData = {
  category: '',
  model: '',
  color: '',
  name: '',
  phone: '',
  email: '',
  city: '',
};

export function ModernQuoteSheet({ isOpen, onClose, prefilledBike, prefilledColor }: ModernQuoteSheetProps) {
  const { t } = useTranslation();
  const hasPrefilledBike = !!prefilledBike;
  const hasPrefilledColor = !!prefilledColor;
  // Si viene con bike + color → salto directo a contacto (paso 4)
  // Si viene solo con bike → salto a color (paso 3)
  // Sin prefilled → flujo completo desde categoría
  const initialStep = hasPrefilledBike ? (hasPrefilledColor ? 4 : 3) : 1;

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [categories] = useState<CategoryWithModels[]>(getModelsByCategory());
  const [formData, setFormData] = useState<QuoteFormData>({
    ...emptyForm,
    category: prefilledBike?.category || '',
    model: prefilledBike?.id || '',
    color: prefilledColor?.value || '',
  });

  const selectedCategory = categories.find((cat) => cat.id === formData.category);
  const selectedModel =
    prefilledBike && prefilledBike.id === formData.model
      ? prefilledBike
      : selectedCategory?.models.find((m) => m.id === formData.model);
  const selectedColor =
    prefilledColor && prefilledColor.value === formData.color
      ? prefilledColor
      : selectedModel?.colors.find((c) => c.value === formData.color);

  // Sincroniza el estado cada vez que se abre o cambian los datos pre-llenados
  useEffect(() => {
    if (!isOpen) return;
    setCurrentStep(initialStep);
    setFormData((prev) => ({
      ...prev,
      category: prefilledBike?.category || '',
      model: prefilledBike?.id || '',
      color: prefilledColor?.value || '',
    }));
  }, [isOpen, prefilledBike?.id, prefilledColor?.value, initialStep]);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        '.quote-sheet-content',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < 4) {
      gsap.to('.step-content', {
        x: -16,
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          setCurrentStep((s) => s + 1);
          gsap.fromTo('.step-content', { x: 16, opacity: 0 }, { x: 0, opacity: 1, duration: 0.25 });
        },
      });
    }
  };

  const handleBack = () => {
    if (currentStep > initialStep) {
      gsap.to('.step-content', {
        x: 16,
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          setCurrentStep((s) => s - 1);
          gsap.fromTo('.step-content', { x: -16, opacity: 0 }, { x: 0, opacity: 1, duration: 0.25 });
        },
      });
    }
  };

  const handleSubmit = () => {
    const whatsappNumber = '18092468383';
    const message = encodeURIComponent(
      `${t('quote.whatsapp.header')}\n\n` +
        `${t('quote.whatsapp.model')} ${selectedModel?.name || formData.model}\n` +
        `${t('quote.whatsapp.color')} ${selectedColor?.name || formData.color}\n` +
        `${t('quote.whatsapp.name')} ${formData.name}\n` +
        `${t('quote.whatsapp.phone')} ${formData.phone}\n` +
        `${t('quote.whatsapp.email')} ${formData.email}\n` +
        `${t('quote.whatsapp.city')} ${formData.city}`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    onClose();
    setCurrentStep(initialStep);
    setFormData({
      ...emptyForm,
      category: prefilledBike?.category || '',
      model: prefilledBike?.id || '',
      color: prefilledColor?.value || '',
    });
  };

  const resetForm = () => {
    setFormData({
      ...emptyForm,
      category: prefilledBike?.category || '',
      model: prefilledBike?.id || '',
      color: prefilledColor?.value || '',
    });
    setCurrentStep(initialStep);
  };

  if (!isOpen) return null;

  const stepLabels = [t('quote.steps.category'), t('quote.steps.model'), t('quote.steps.color'), t('quote.steps.contact')];
  const totalSteps = 4;
  const stepIndex = currentStep - 1;
  const canGoBack = currentStep > initialStep;
  const showStepper = !hasPrefilledBike;

  return (
    <div className="fixed inset-0 z-[200] flex items-end lg:items-center lg:justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="quote-sheet-content relative w-full lg:w-auto lg:min-w-[640px] lg:max-w-3xl max-h-[92vh] lg:max-h-[88vh] bg-white rounded-t-3xl lg:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-neutral-900 px-5 lg:px-7 py-4 lg:py-5 shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0">
              <h2 className="font-display text-xl lg:text-2xl font-bold text-white tracking-wide uppercase truncate">
                {hasPrefilledBike ? t('quote.titlePrefilled', { name: prefilledBike.name }) : t('quote.titleDefault')}
              </h2>
              {showStepper && (
                <p className="text-neutral-400 text-[11px] lg:text-xs mt-1 font-accent tracking-[0.18em]">
                  {t('quote.stepLabel', { current: currentStep, total: totalSteps, label: stepLabels[stepIndex] })}
                </p>
              )}
              {hasPrefilledBike && selectedColor && (
                <p className="text-neutral-400 text-[11px] lg:text-xs mt-1 font-accent tracking-[0.18em]">
                  {t('quote.colorLabel', { name: selectedColor.name.toUpperCase() })}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="shrink-0 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors"
              aria-label={t('quote.buttons.close')}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress bar (solo en flujo completo) */}
          {showStepper && (
            <div className="mt-4 relative">
              <div className="w-full bg-white/10 rounded-full h-1">
                <div
                  className="bg-[var(--color-primary)] h-1 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Scroll area */}
        <div className="step-content flex-1 overflow-y-auto px-5 lg:px-7 py-5 lg:py-7">
          {currentStep === 1 && (
            <CategoryStep
              categories={categories}
              onSelect={(categoryId) => {
                setFormData({ ...formData, category: categoryId, model: '', color: '' });
                handleNext();
              }}
            />
          )}

          {currentStep === 2 && selectedCategory && (
            <ModelStep
              category={selectedCategory}
              onSelect={(modelId) => {
                setFormData({ ...formData, model: modelId, color: '' });
                handleNext();
              }}
            />
          )}

          {currentStep === 3 && selectedModel && (
            <ColorStep
              model={selectedModel}
              onSelect={(colorValue) => {
                setFormData({ ...formData, color: colorValue });
                handleNext();
              }}
            />
          )}

          {currentStep === 4 && (
            <ContactStep
              formData={formData}
              onChange={setFormData}
              selectedModel={selectedModel}
              selectedColor={selectedColor}
            />
          )}
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 border-t border-neutral-200 px-5 lg:px-7 py-3 lg:py-4 flex justify-between items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {canGoBack && (
              <button
                onClick={handleBack}
                className="px-4 lg:px-5 py-2.5 text-[11px] lg:text-xs font-bold tracking-[0.15em] font-accent text-neutral-700 hover:text-neutral-900 border border-neutral-300 hover:border-neutral-900 transition-colors"
              >
                {t('quote.buttons.previous')}
              </button>
            )}
            {!hasPrefilledBike && (
              <button
                onClick={resetForm}
                className="text-[11px] text-neutral-500 hover:text-[var(--color-primary)] transition-colors"
              >
                {t('quote.buttons.reset')}
              </button>
            )}
          </div>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={!getStepValue(formData, currentStep)}
              className="px-5 lg:px-7 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-[11px] lg:text-xs font-bold tracking-[0.18em] font-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {t('quote.buttons.next')}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!formData.name || !formData.phone}
              className="px-5 lg:px-7 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-[11px] lg:text-xs font-bold tracking-[0.18em] font-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {t('quote.buttons.send')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/* CATEGORY STEP                                           */
/* ─────────────────────────────────────────────────────── */
function CategoryStep({
  categories,
  onSelect,
}: {
  categories: CategoryWithModels[];
  onSelect: (categoryId: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="text-center mb-5">
        <h3 className="font-display text-2xl lg:text-3xl font-bold text-neutral-900 tracking-tight uppercase">
          {t('quote.category.title')}
        </h3>
        <p className="text-neutral-500 text-sm mt-1">{t('quote.category.subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:gap-4">
        {categories.map((category) => {
          const count = category.models.length;
          const disabled = count === 0;
          return (
            <button
              key={category.id}
              onClick={() => !disabled && onSelect(category.id)}
              disabled={disabled}
              className={`group relative bg-white border-2 rounded-xl p-4 lg:p-5 text-left transition-all ${
                disabled
                  ? 'border-neutral-100 opacity-50 cursor-not-allowed'
                  : 'border-neutral-200 hover:border-[var(--color-primary)] hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 lg:w-14 lg:h-14 shrink-0 bg-neutral-100 group-hover:bg-[var(--color-primary)]/5 rounded-full flex items-center justify-center text-2xl lg:text-3xl transition-colors">
                  {getCategoryIcon(category.id)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-display text-base lg:text-lg font-bold text-neutral-900 tracking-wide uppercase leading-tight">
                    {t(category.name)}
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {disabled
                      ? t('quote.category.comingSoon')
                      : `${count} ${count !== 1 ? t('quote.category.modelCountPlural') : t('quote.category.modelCountSingular')}`}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/* MODEL STEP                                              */
/* ─────────────────────────────────────────────────────── */
function ModelStep({
  category,
  onSelect,
}: {
  category: CategoryWithModels;
  onSelect: (modelId: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="text-center mb-5">
        <h3 className="font-display text-2xl lg:text-3xl font-bold text-neutral-900 tracking-tight uppercase">
          {t('quote.model.title', { category: t(category.name) })}
        </h3>
        <p className="text-neutral-500 text-sm mt-1">{t('quote.model.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
        {category.models.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelect(model.id)}
            className="group bg-white rounded-xl overflow-hidden border-2 border-neutral-200 hover:border-[var(--color-primary)] hover:shadow-md transition-all text-left"
          >
            <div className="relative h-36 sm:h-44 bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden">
              {model.colors[0]?.images.main && (
                <img
                  src={model.colors[0]?.images.main}
                  alt={model.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              )}
            </div>
            <div className="p-4">
              <h4 className="font-display text-xl font-bold text-neutral-900 tracking-tight uppercase leading-none">
                {model.name}
              </h4>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-neutral-500">
                  {model.colors.length} {model.colors.length !== 1 ? t('quote.model.colorCountPlural') : t('quote.model.colorCountSingular')}
                </span>
                <div className="flex -space-x-1">
                  {model.colors.slice(0, 4).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/* COLOR STEP                                              */
/* ─────────────────────────────────────────────────────── */
function ColorStep({ model, onSelect }: { model: BikeModel; onSelect: (colorValue: string) => void }) {
  const { t } = useTranslation();
  const [previewColor, setPreviewColor] = useState(model.colors[0]?.value || '');

  return (
    <div>
      <div className="text-center mb-5">
        <h3 className="font-display text-2xl lg:text-3xl font-bold text-neutral-900 tracking-tight uppercase">
          {t('quote.color.title', { model: model.name })}
        </h3>
        <p className="text-neutral-500 text-sm mt-1">{t('quote.color.subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Preview */}
        <div className="order-2 lg:order-1">
          <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-6 h-48 lg:h-64 flex items-center justify-center">
            <img
              src={getModelImage(model.name, previewColor || model.colors[0]?.value)}
              alt={`${model.name} ${previewColor}`}
              className="max-w-full max-h-full object-contain transition-all duration-300"
              style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}
            />
          </div>
        </div>

        {/* Color list */}
        <div className="order-1 lg:order-2 space-y-2">
          {model.colors.map((color) => (
            <button
              key={color.value}
              onClick={() => onSelect(color.value)}
              onMouseEnter={() => setPreviewColor(color.value)}
              className="group w-full flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-neutral-200 hover:border-[var(--color-primary)] transition-colors text-left"
            >
              <div
                className="w-9 h-9 rounded-full border-2 border-white shadow ring-1 ring-neutral-200"
                style={{ backgroundColor: color.hex }}
              />
              <span className="flex-1 font-display text-base font-bold text-neutral-900 uppercase tracking-wide">
                {color.name}
              </span>
              <svg
                className="w-4 h-4 text-neutral-400 group-hover:text-[var(--color-primary)] transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/* CONTACT STEP                                            */
/* ─────────────────────────────────────────────────────── */
function ContactStep({
  formData,
  onChange,
  selectedModel,
  selectedColor,
}: {
  formData: QuoteFormData;
  onChange: (data: QuoteFormData) => void;
  selectedModel?: BikeModel;
  selectedColor?: BikeColor;
}) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="text-center mb-5">
        <h3 className="font-display text-2xl lg:text-3xl font-bold text-neutral-900 tracking-tight uppercase">
          {t('quote.contact.title')}
        </h3>
        <p className="text-neutral-500 text-sm mt-1">{t('quote.contact.subtitle')}</p>
      </div>

      {/* Resumen */}
      {selectedModel && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 lg:p-4 flex items-center gap-3 mb-5">
          <img
            src={getModelImage(selectedModel.name, selectedColor?.value || selectedModel.colors[0]?.value || '')}
            alt={selectedModel.name}
            className="w-16 h-16 lg:w-20 lg:h-20 object-contain shrink-0"
          />
          <div className="min-w-0">
            <h5 className="font-display text-lg font-bold text-neutral-900 uppercase tracking-tight leading-none">
              {selectedModel.name}
            </h5>
            {selectedColor && (
              <p className="text-xs text-neutral-500 mt-1">{t('quote.contact.summaryColor', { name: selectedColor.name })}</p>
            )}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder={t('quote.contact.fullName')}
          value={formData.name}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
          className="w-full p-3 rounded-lg border-2 border-neutral-200 focus:border-[var(--color-primary)] focus:outline-none transition-colors bg-white text-sm"
        />
        <input
          type="tel"
          placeholder={t('quote.contact.phone')}
          value={formData.phone}
          onChange={(e) => onChange({ ...formData, phone: e.target.value })}
          className="w-full p-3 rounded-lg border-2 border-neutral-200 focus:border-[var(--color-primary)] focus:outline-none transition-colors bg-white text-sm"
        />
        <input
          type="email"
          placeholder={t('quote.contact.email')}
          value={formData.email}
          onChange={(e) => onChange({ ...formData, email: e.target.value })}
          className="w-full p-3 rounded-lg border-2 border-neutral-200 focus:border-[var(--color-primary)] focus:outline-none transition-colors bg-white text-sm"
        />
        <input
          type="text"
          placeholder={t('quote.contact.city')}
          value={formData.city}
          onChange={(e) => onChange({ ...formData, city: e.target.value })}
          className="w-full p-3 rounded-lg border-2 border-neutral-200 focus:border-[var(--color-primary)] focus:outline-none transition-colors bg-white text-sm"
        />
      </div>

      <p className="text-[11px] text-neutral-500 mt-4">
        {t('quote.contact.disclaimer')}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/* Helpers                                                 */
/* ─────────────────────────────────────────────────────── */
function getCategoryIcon(categoryId: string): string {
  const icons: Record<string, string> = {
    motocicleta: '🏍️',
    passola: '🛵',
    atv: '🏎️',
    sport: '🏁',
  };
  return icons[categoryId] || '🚗';
}

function getStepValue(formData: QuoteFormData, step: number): string {
  const fields: Array<keyof QuoteFormData> = ['category', 'model', 'color', 'name'];
  const key = fields[step - 1];
  return formData[key] || '';
}
