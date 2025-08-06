import { useState } from 'react';
import { useCountryStore, COUNTRIES } from '@/store/countryStore';

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-blue-500/5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl transform translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl transform -translate-x-48 translate-y-48"></div>
      
      <div className="relative z-10">
        {/* Sección principal del footer */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Columna 1: Logo y descripción */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <img 
                  src="/logo-full-white.png" 
                  alt="Super Tucán" 
                  className="h-16 w-auto mb-4 filter drop-shadow-lg"
                />
                <p className="text-gray-300 text-sm leading-relaxed">
                  Líderes en vehículos de calidad para toda Latinoamérica. 
                  Innovación, confiabilidad y servicio excepcional desde hace más de una década.
                </p>
              </div>
              
              {/* Redes sociales */}
              <div className="space-y-4">
                <h4 
                  className="text-lg font-black tracking-wider text-red-400"
                  style={{ fontFamily: 'Bebas Neue' }}
                >
                  SÍGUENOS
                </h4>
                <div className="flex space-x-4">
                  <SocialLink icon="facebook" href="#" />
                  <SocialLink icon="instagram" href="#" />
                  <SocialLink icon="youtube" href="#" />
                  <SocialLink icon="tiktok" href="#" />
                  <SocialLink icon="whatsapp" href="#" />
                </div>
              </div>
            </div>
            
            {/* Columna 2: Productos */}
            <div>
              <h4 
                className="text-xl font-black mb-6 tracking-wider text-red-400"
                style={{ fontFamily: 'Bebas Neue' }}
              >
                PRODUCTOS
              </h4>
              <ul className="space-y-3">
                <FooterLink href="#" text="Motocicletas" />
                <FooterLink href="#" text="Passolas" />
                <FooterLink href="#" text="Vehículos Sport" />
                <FooterLink href="#" text="ATVs" />
                <FooterLink href="#" text="Repuestos Originales" />
                <FooterLink href="#" text="Accesorios" />
              </ul>
            </div>
            
            {/* Columna 3: Servicios */}
            <div>
              <h4 
                className="text-xl font-black mb-6 tracking-wider text-red-400"
                style={{ fontFamily: 'Bebas Neue' }}
              >
                SERVICIOS
              </h4>
              <ul className="space-y-3">
                <FooterLink href="#" text="Servicio Técnico" />
                <FooterLink href="#" text="Garantía" />
                <FooterLink href="#" text="Financiamiento" />
                <FooterLink href="#" text="Dealers Autorizados" />
                <FooterLink href="#" text="Capacitación" />
                <FooterLink href="#" text="Soporte 24/7" />
              </ul>
            </div>
            
            {/* Columna 4: Contacto y país */}
            <div>
              <h4 
                className="text-xl font-black mb-6 tracking-wider text-red-400"
                style={{ fontFamily: 'Bebas Neue' }}
              >
                CONTACTO
              </h4>
              
              {/* Selector de país */}
              <div className="mb-6">
                <CountrySelector />
              </div>
              
              {/* Información de contacto */}
              <div className="space-y-4">
                <ContactInfo 
                  icon="phone" 
                  title="TELÉFONO"
                  content="+1 (800) 123-4567"
                />
                <ContactInfo 
                  icon="email" 
                  title="EMAIL"
                  content="info@supertucan.com"
                />
                <ContactInfo 
                  icon="location" 
                  title="SEDE PRINCIPAL"
                  content="Ciudad de Panamá, Panamá"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
              <div className="text-center lg:text-left">
                <h4 
                  className="text-2xl font-black mb-2 tracking-wider"
                  style={{ fontFamily: 'Bebas Neue' }}
                >
                  MANTENTE INFORMADO
                </h4>
                <p className="text-gray-300">Recibe las últimas noticias, promociones y lanzamientos</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <input
                  type="email"
                  placeholder="Tu email aquí"
                  className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm min-w-[300px]"
                />
                <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl font-black hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <span style={{ fontFamily: 'Bebas Neue' }}>SUSCRIBIRSE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer bottom */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-400 text-center md:text-left">
                <p>&copy; 2024 Super Tucán. Todos los derechos reservados.</p>
                <p className="mt-1">Diseñado con ❤️ para Latinoamérica</p>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
                <FooterLink href="#" text="Términos y Condiciones" small />
                <FooterLink href="#" text="Política de Privacidad" small />
                <FooterLink href="#" text="Política de Cookies" small />
                <FooterLink href="#" text="Aviso Legal" small />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Componente selector de país
function CountrySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedCountry, setCountry } = useCountryStore();
  
  // Usar el país seleccionado del store global, con fallback a República Dominicana
  const currentCountry = selectedCountry || COUNTRIES.find(c => c.code === 'dominican_republic');
  
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-2">Tu país:</label>
      
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg">{currentCountry?.flag}</span>
          <span className="font-medium">{currentCountry?.name}</span>
        </div>
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50 max-h-60 overflow-y-auto">
          {COUNTRIES.map((country) => (
            <button
              key={country.code}
              onClick={() => {
                setCountry(country);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 transition-all duration-200 text-left ${
                selectedCountry?.code === country.code
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-lg">{country.flag}</span>
              <div className="flex-1">
                <span className="font-medium">{country.name}</span>
                <span className="text-sm opacity-75 ml-2">{country.phone}</span>
              </div>
              {selectedCountry?.code === country.code && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente para links del footer
function FooterLink({ href, text, small = false }: { 
  href: string; 
  text: string; 
  small?: boolean; 
}) {
  return (
    <li className={small ? '' : 'list-none'}>
      <a
        href={href}
        className={`${
          small 
            ? 'text-gray-400 hover:text-white' 
            : 'text-gray-300 hover:text-red-400'
        } transition-colors duration-300 hover:underline ${small ? 'text-sm' : ''}`}
      >
        {text}
      </a>
    </li>
  );
}

// Componente para redes sociales
function SocialLink({ icon, href }: { icon: string; href: string }) {
  const getIcon = () => {
    switch (icon) {
      case 'facebook':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.986 11.988 11.986s11.987-5.366 11.987-11.986C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.317C4.198 14.553 3.5 13.353 3.5 11.987s.698-2.566 1.626-3.684c.875-.827 2.026-1.317 3.323-1.317s2.448.49 3.323 1.317c.928 1.118 1.626 2.318 1.626 3.684s-.698 2.566-1.626 3.684c-.875.827-2.026 1.317-3.323 1.317z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'tiktok':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        );
      case 'whatsapp':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <a
      href={href}
      className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-500 transition-all duration-300 transform hover:scale-110"
    >
      {getIcon()}
    </a>
  );
}

// Componente para información de contacto
function ContactInfo({ icon, title, content }: { 
  icon: string; 
  title: string; 
  content: string; 
}) {
  const getIcon = () => {
    switch (icon) {
      case 'phone':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'email':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'location':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center text-red-400">
        {getIcon()}
      </div>
      <div>
        <h5 
          className="text-sm font-black tracking-wider text-gray-400"
          style={{ fontFamily: 'Bebas Neue' }}
        >
          {title}
        </h5>
        <p className="text-white font-medium">{content}</p>
      </div>
    </div>
  );
}