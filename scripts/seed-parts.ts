import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Firebase init
// ---------------------------------------------------------------------------
const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'service-account.json'), 'utf-8')
);

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

// ---------------------------------------------------------------------------
// Data definitions
// ---------------------------------------------------------------------------

interface PartCategoryDef {
  name: string;
  icon: string;
  order: number;
}

interface PartDef {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  price: number;
  originalPrice: number | null;
  discount: number;
  inStock: boolean;
  compatibleModels: string[];
  image: string;
  order: number;
}

const partsCategories: Record<string, PartCategoryDef> = {
  motor: {
    name: 'MOTOR',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    order: 0,
  },
  carroceria: {
    name: 'CARROCERÍA',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    order: 1,
  },
  electrico: {
    name: 'ELÉCTRICO',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    order: 2,
  },
  frenos: {
    name: 'FRENOS',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    order: 3,
  },
  suspension: {
    name: 'SUSPENSIÓN',
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    order: 4,
  },
  accesorios: {
    name: 'ACCESORIOS',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    order: 5,
  },
};

const parts: PartDef[] = [
  {
    id: 'filtro-aceite-original',
    name: 'Filtro de Aceite Original',
    categoryId: 'motor',
    description: 'Filtro de aceite original para motocicletas SuperTucan. Garantiza una lubricación óptima del motor.',
    price: 25.99,
    originalPrice: 32.99,
    discount: 20,
    inStock: true,
    compatibleModels: ['adri-sport', 'bws', 'cg200'],
    image: '',
    order: 0,
  },
  {
    id: 'pastillas-freno-delanteras',
    name: 'Pastillas de Freno Delanteras',
    categoryId: 'frenos',
    description: 'Pastillas de freno delanteras de alto rendimiento. Material semi-metálico para máxima frenada.',
    price: 45.99,
    originalPrice: null,
    discount: 0,
    inStock: true,
    compatibleModels: ['adri-sport'],
    image: '',
    order: 1,
  },
  {
    id: 'carenado-lateral-izquierdo',
    name: 'Carenado Lateral Izquierdo',
    categoryId: 'carroceria',
    description: 'Carenado lateral izquierdo de repuesto. Plástico ABS de alta resistencia con acabado original.',
    price: 89.99,
    originalPrice: 109.99,
    discount: 18,
    inStock: false,
    compatibleModels: ['bws'],
    image: '',
    order: 2,
  },
  {
    id: 'bombillo-led-h4',
    name: 'Bombillo LED H4',
    categoryId: 'electrico',
    description: 'Bombillo LED H4 de alta luminosidad. Mayor visibilidad y menor consumo energético.',
    price: 15.99,
    originalPrice: null,
    discount: 0,
    inStock: true,
    compatibleModels: ['adri-sport', 'bws', 'cg200', 'st-125'],
    image: '',
    order: 3,
  },
  {
    id: 'kit-cadena-pinon',
    name: 'Kit de Cadena y Piñón',
    categoryId: 'motor',
    description: 'Kit completo de cadena y piñón. Incluye cadena reforzada y piñones de acero templado.',
    price: 67.50,
    originalPrice: 79.99,
    discount: 15,
    inStock: true,
    compatibleModels: ['cg200', 'st-125'],
    image: '',
    order: 4,
  },
  {
    id: 'amortiguador-trasero',
    name: 'Amortiguador Trasero',
    categoryId: 'suspension',
    description: 'Amortiguador trasero de gas. Ajustable en precarga para una conducción personalizada.',
    price: 120.00,
    originalPrice: null,
    discount: 0,
    inStock: true,
    compatibleModels: ['adri-sport'],
    image: '',
    order: 5,
  },
];

// ---------------------------------------------------------------------------
// Seed functions
// ---------------------------------------------------------------------------

async function seedPartsCategories(): Promise<void> {
  console.log('\n── Seeding parts categories ──');

  for (const [id, data] of Object.entries(partsCategories)) {
    await db.collection('partsCategories').doc(id).set(data, { merge: true });
    console.log(`  ✔ Category "${data.name}" (${id})`);
  }
}

async function seedParts(): Promise<void> {
  console.log('\n── Seeding parts ──');

  for (const part of parts) {
    const { id, ...data } = part;
    await db.collection('parts').doc(id).set(
      {
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    console.log(`  ✔ Part "${part.name}" (${id}) — models: [${part.compatibleModels.join(', ')}]`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('🚀 Starting SuperTucan parts seed...\n');

  try {
    await seedPartsCategories();
    await seedParts();
    console.log('\n✅ Parts seed completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Parts seed failed:', error);
    process.exit(1);
  }
}

main();
