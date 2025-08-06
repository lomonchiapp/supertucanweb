import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { getModelsByCategory, type BikeCategory, type BikeModel, type BikeColor, getModelImage } from '@/utils/bikeSystem';

interface ModernQuoteSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModernQuoteSheet({ isOpen, onClose }: ModernQuoteSheetProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [categories] = useState<BikeCategory[]>(getModelsByCategory());
  const [formData, setFormData] = useState({
    category: '',
    model: '',
    color: '',
    name: '',
    phone: '',
    email: '',
    city: ''
  });

  const selectedCategory = categories.find(cat => cat.id === formData.category);
  const selectedModel = selectedCategory?.models.find(model => model.id === formData.model);
  const selectedColor = selectedModel?.colors.find(color => color.value === formData.color);

  // Animaciones de entrada
  useEffect(() => {
    if (isOpen) {
      gsap.fromTo('.quote-sheet-content', 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < 4) {
      gsap.to('.step-content', {
        x: -20,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setCurrentStep(currentStep + 1);
          gsap.fromTo('.step-content', 
            { x: 20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3 }
          );
        }
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      gsap.to('.step-content', {
        x: 20,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setCurrentStep(currentStep - 1);
          gsap.fromTo('.step-content', 
            { x: -20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3 }
          );
        }
      });
    }
  };

  const handleSubmit = () => {
    console.log('Cotización enviada:', formData);
    onClose();
    setCurrentStep(1);
    setFormData({
      category: '',
      model: '',
      color: '',
      name: '',
      phone: '',
      email: '',
      city: ''
    });
  };

  const resetForm = () => {
    setFormData({
      category: '',
      model: '',
      color: '',
      name: '',
      phone: '',
      email: '',
      city: ''
    });
    setCurrentStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end lg:items-center lg:justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sheet Container */}
      <div className="quote-sheet-content relative w-full lg:w-auto lg:min-w-[600px] lg:max-w-4xl bg-gradient-to-br from-white via-gray-50 to-white rounded-t-3xl lg:rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header con gradiente */}
        <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 px-6 py-6">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-blue-600/10" />
          
          <div className="relative flex justify-between items-center">
            <div>
              <h2 
                className="text-3xl font-black text-white tracking-wider"
                style={{ fontFamily: 'Bebas Neue' }}
              >
                COTIZAR VEHÍCULO
              </h2>
              <p className="text-gray-300 text-sm mt-1">
                Paso {currentStep} de 4 • {['Categoría', 'Modelo', 'Color', 'Contacto'][currentStep - 1]}
              </p>
            </div>
            
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
            >
              <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress bar moderno */}
          <div className="mt-6 relative">
            <div className="w-full bg-gray-700/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>
            <div className="flex justify-between mt-2">
              {[1, 2, 3, 4].map((step) => (
                <div 
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step <= currentStep 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/50' 
                      : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="step-content p-6 lg:p-8 min-h-[400px] lg:min-h-[500px]">
          
          {/* Paso 1: Categorías */}
          {currentStep === 1 && (
            <CategoryStep 
              categories={categories}
              onSelect={(categoryId) => {
                setFormData({...formData, category: categoryId, model: '', color: ''});
                handleNext();
              }}
            />
          )}
          
          {/* Paso 2: Modelos */}
          {currentStep === 2 && selectedCategory && (
            <ModelStep 
              category={selectedCategory}
              selectedModel={formData.model}
              onSelect={(modelId) => {
                setFormData({...formData, model: modelId, color: ''});
                handleNext();
              }}
            />
          )}
          
          {/* Paso 3: Colores */}
          {currentStep === 3 && selectedModel && (
            <ColorStep 
              model={selectedModel}
              selectedColor={formData.color}
              onSelect={(colorValue) => {
                setFormData({...formData, color: colorValue});
                handleNext();
              }}
            />
          )}
          
          {/* Paso 4: Información de contacto */}
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
        <div className="bg-gray-100 px-6 lg:px-8 py-4 flex justify-between items-center border-t border-gray-200">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button 
                onClick={handleBack}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-red-500 hover:text-red-600 transition-all duration-300 transform hover:scale-105"
              >
                ANTERIOR
              </button>
            )}
            
            <button 
              onClick={resetForm}
              className="px-4 py-3 text-gray-500 hover:text-red-600 transition-colors duration-300 text-sm font-medium"
            >
              Reiniciar
            </button>
          </div>
          
          {currentStep < 4 ? (
            <button 
              onClick={handleNext}
              disabled={!getStepValue(formData, currentStep)}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              SIGUIENTE
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={!formData.name || !formData.phone}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              ENVIAR COTIZACIÓN
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente para selección de categorías
function CategoryStep({ categories, onSelect }: {
  categories: BikeCategory[];
  onSelect: (categoryId: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 
          className="text-3xl font-black text-gray-900 mb-3 tracking-wider"
          style={{ fontFamily: 'Bebas Neue' }}
        >
          ¿QUÉ TIPO DE VEHÍCULO TE INTERESA?
        </h3>
        <p className="text-gray-600">Selecciona la categoría que más te guste</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className="group relative bg-white rounded-2xl p-6 lg:p-8 border-2 border-gray-200 hover:border-red-500 hover:shadow-xl transition-all duration-500 transform hover:scale-105"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradiente de fondo al hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-4xl group-hover:from-red-50 group-hover:to-red-100 transition-all duration-300">
                {getCategoryIcon(category.id)}
              </div>
              
              <h4 
                className="text-xl font-black text-gray-900 tracking-wider group-hover:text-red-600 transition-colors duration-300"
                style={{ fontFamily: 'Bebas Neue' }}
              >
                {category.name}
              </h4>
              
              <p className="text-sm text-gray-500 mt-2">
                {category.models.length} modelo{category.models.length !== 1 ? 's' : ''} disponible{category.models.length !== 1 ? 's' : ''}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Componente para selección de modelos
function ModelStep({ category, selectedModel, onSelect }: {
  category: BikeCategory;
  selectedModel: string;
  onSelect: (modelId: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 
          className="text-3xl font-black text-gray-900 mb-3 tracking-wider"
          style={{ fontFamily: 'Bebas Neue' }}
        >
          MODELOS DE {category.name}
        </h3>
        <p className="text-gray-600">Elige el modelo perfecto para ti</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {category.models.map((model, index) => (
          <button
            key={model.id}
            onClick={() => onSelect(model.id)}
            className="group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-red-500 hover:shadow-xl transition-all duration-500 transform hover:scale-105"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Imagen del modelo */}
            <div className="relative h-48 lg:h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
              {model.mainImage && (
                <img 
                  src={model.mainImage}
                  alt={model.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                />
              )}
              
              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Información del modelo */}
            <div className="p-6">
              <h4 
                className="text-2xl font-black text-gray-900 mb-2 tracking-wider group-hover:text-red-600 transition-colors duration-300"
                style={{ fontFamily: 'Bebas Neue' }}
              >
                {model.name}
              </h4>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{model.colors.length} colores disponibles</span>
                <div className="flex space-x-1">
                  {model.colors.slice(0, 4).map((color, idx) => (
                    <div 
                      key={idx}
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color.code }}
                    />
                  ))}
                  {model.colors.length > 4 && (
                    <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                      +
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Componente para selección de colores
function ColorStep({ model, selectedColor, onSelect }: {
  model: BikeModel;
  selectedColor: string;
  onSelect: (colorValue: string) => void;
}) {
  const [previewColor, setPreviewColor] = useState(model.colors[0]?.value || '');
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 
          className="text-3xl font-black text-gray-900 mb-3 tracking-wider"
          style={{ fontFamily: 'Bebas Neue' }}
        >
          ELIGE EL COLOR DE TU {model.name}
        </h3>
        <p className="text-gray-600">Selecciona el color que más te guste</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Preview de la imagen */}
        <div className="order-2 lg:order-1">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 h-80 flex items-center justify-center">
            <img 
              src={getModelImage(model.folder, previewColor || model.colors[0]?.value)}
              alt={`${model.name} ${previewColor}`}
              className="w-full h-full object-contain transition-all duration-500"
              style={{
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
              }}
            />
          </div>
        </div>
        
        {/* Selección de colores */}
        <div className="order-1 lg:order-2 space-y-4">
          {model.colors.map((color, index) => (
            <button
              key={color.value}
              onClick={() => onSelect(color.value)}
              onMouseEnter={() => setPreviewColor(color.value)}
              className="group w-full flex items-center p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-red-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div 
                className="w-12 h-12 rounded-full border-4 border-white shadow-lg mr-4 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: color.code }}
              />
              
              <div className="flex-1 text-left">
                <h5 
                  className="text-lg font-black text-gray-900 group-hover:text-red-600 transition-colors duration-300"
                  style={{ fontFamily: 'Bebas Neue' }}
                >
                  {color.name}
                </h5>
              </div>
              
              <svg className="w-6 h-6 text-gray-400 group-hover:text-red-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente para información de contacto
function ContactStep({ formData, onChange, selectedModel, selectedColor }: {
  formData: any;
  onChange: (data: any) => void;
  selectedModel?: BikeModel;
  selectedColor?: BikeColor;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 
          className="text-3xl font-black text-gray-900 mb-3 tracking-wider"
          style={{ fontFamily: 'Bebas Neue' }}
        >
          INFORMACIÓN DE CONTACTO
        </h3>
        <p className="text-gray-600">Últimos datos para enviarte tu cotización</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Resumen de la selección */}
        <div className="order-2 lg:order-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
          <h4 
            className="text-xl font-black text-gray-900 mb-4 tracking-wider"
            style={{ fontFamily: 'Bebas Neue' }}
          >
            TU SELECCIÓN
          </h4>
          
          {selectedModel && selectedColor && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 flex items-center space-x-4">
                <img 
                  src={getModelImage(selectedModel.folder, selectedColor.value)}
                  alt={`${selectedModel.name} ${selectedColor.name}`}
                  className="w-20 h-20 object-contain"
                />
                <div>
                  <h5 
                    className="text-lg font-black text-gray-900"
                    style={{ fontFamily: 'Bebas Neue' }}
                  >
                    {selectedModel.name}
                  </h5>
                  <p className="text-gray-600">Color: {selectedColor.name}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Formulario */}
        <div className="order-1 lg:order-2 space-y-4">
          <input
            type="text"
            placeholder="Nombre completo *"
            value={formData.name}
            onChange={(e) => onChange({...formData, name: e.target.value})}
            className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all duration-300 bg-white"
          />
          
          <input
            type="tel"
            placeholder="Teléfono *"
            value={formData.phone}
            onChange={(e) => onChange({...formData, phone: e.target.value})}
            className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all duration-300 bg-white"
          />
          
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => onChange({...formData, email: e.target.value})}
            className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all duration-300 bg-white"
          />
          
          <input
            type="text"
            placeholder="Ciudad"
            value={formData.city}
            onChange={(e) => onChange({...formData, city: e.target.value})}
            className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all duration-300 bg-white"
          />
          
          <p className="text-xs text-gray-500 mt-4">
            * Campos obligatorios. Al enviar acepta nuestros términos y condiciones.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helpers
function getCategoryIcon(categoryId: string): string {
  const icons: { [key: string]: string } = {
    'motocicletas': '🏍️',
    'scooters': '🛵',
    'sport': '🏁'
  };
  return icons[categoryId] || '🚗';
}

function getStepValue(formData: any, step: number): string {
  const fields = ['category', 'model', 'color', 'name'];
  return formData[fields[step - 1]] || '';
}