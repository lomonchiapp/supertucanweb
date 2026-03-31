import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
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
  storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
});

const db = getFirestore(app);
const bucket = getStorage(app).bucket();

// ---------------------------------------------------------------------------
// Data definitions
// ---------------------------------------------------------------------------

interface CategoryDef {
  name: string;
  description: string;
  order: number;
}

interface ColorDef {
  name: string;
  value: string;
  hex: string;
  order: number;
  /** Folder name inside public/bikes/MODEL_NAME/ */
  folder: string;
  /** Number of numbered gallery images (1.avif … N.avif) */
  galleryCount: number;
}

interface ModelDef {
  slug: string;
  name: string;
  category: string;
  featured?: boolean;
  description: string;
  specs: { engine: string; maxSpeed: string };
  order: number;
  colors: ColorDef[];
}

const categories: Record<string, CategoryDef> = {
  motocicleta: {
    name: 'MOTOCICLETA',
    description: 'Potencia y versatilidad para todo terreno',
    order: 0,
  },
  passola: {
    name: 'PASSOLA',
    description: 'Ideal para la ciudad y uso urbano',
    order: 1,
  },
  atv: {
    name: 'ATV',
    description: 'Aventura y diversión off-road',
    order: 2,
  },
  sport: {
    name: 'SPORT',
    description: 'Velocidad y rendimiento deportivo',
    order: 3,
  },
};

const models: ModelDef[] = [
  {
    slug: 'adri-sport',
    name: 'ADRI SPORT',
    category: 'motocicleta',
    featured: true,
    description:
      'Experimenta la potencia y agilidad de nuestra motocicleta deportiva más avanzada',
    specs: { engine: '125CC', maxSpeed: '85KM/H' },
    order: 0,
    colors: [
      { name: 'Azul', value: 'azul', hex: '#3B82F6', order: 0, folder: 'azul', galleryCount: 3 },
      { name: 'Blanca', value: 'blanca', hex: '#FFFFFF', order: 1, folder: 'blanca', galleryCount: 3 },
      { name: 'Negra', value: 'negra', hex: '#1F2937', order: 2, folder: 'negra', galleryCount: 2 },
      { name: 'Roja', value: 'roja', hex: '#EF4444', order: 3, folder: 'roja', galleryCount: 1 },
    ],
  },
  {
    slug: 'bws',
    name: 'BWS',
    category: 'passola',
    description: 'Diseño urbano y versatilidad para la ciudad moderna',
    specs: { engine: '125CC', maxSpeed: '80KM/H' },
    order: 0,
    colors: [
      { name: 'Azul', value: 'azul', hex: '#3B82F6', order: 0, folder: 'azul', galleryCount: 3 },
      { name: 'Blanco', value: 'blanco', hex: '#FFFFFF', order: 1, folder: 'blanco', galleryCount: 6 },
    ],
  },
  {
    slug: 'cg200',
    name: 'CG200',
    category: 'motocicleta',
    description: 'Potencia y resistencia para todas tus aventuras',
    specs: { engine: '200CC', maxSpeed: '95KM/H' },
    order: 1,
    colors: [
      { name: 'Rojo', value: 'rojo', hex: '#EF4444', order: 0, folder: 'rojo', galleryCount: 9 },
    ],
  },
  {
    slug: 'st-125',
    name: 'ST 125',
    category: 'sport',
    description: 'Rendimiento deportivo con estilo moderno',
    specs: { engine: '125CC', maxSpeed: '90KM/H' },
    order: 0,
    colors: [
      { name: 'Azul', value: 'azul', hex: '#3B82F6', order: 0, folder: 'azul', galleryCount: 1 },
      { name: 'Negro', value: 'negro', hex: '#1F2937', order: 1, folder: 'negro', galleryCount: 0 },
      { name: 'Rojo', value: 'rojo', hex: '#EF4444', order: 2, folder: 'rojo', galleryCount: 6 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');

async function uploadImage(
  localPath: string,
  storagePath: string
): Promise<string> {
  const file = bucket.file(storagePath);

  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: {
      contentType: 'image/avif',
      cacheControl: 'public, max-age=31536000',
    },
  });

  // Make the file publicly readable and get its public URL
  await file.makePublic();
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

  console.log(`  ✔ Uploaded ${storagePath}`);
  return publicUrl;
}

// ---------------------------------------------------------------------------
// Seed functions
// ---------------------------------------------------------------------------

async function seedCategories(): Promise<void> {
  console.log('\n── Seeding categories ──');

  for (const [id, data] of Object.entries(categories)) {
    await db.collection('categories').doc(id).set(
      {
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    console.log(`  ✔ Category "${data.name}" (${id})`);
  }
}

async function seedModels(): Promise<void> {
  console.log('\n── Seeding models ──');

  for (const model of models) {
    // Write the model document
    const modelData: Record<string, unknown> = {
      name: model.name,
      category: model.category,
      description: model.description,
      specs: model.specs,
      order: model.order,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (model.featured) {
      modelData.featured = true;
    }

    await db.collection('models').doc(model.slug).set(modelData, { merge: true });
    console.log(`\n  ✔ Model "${model.name}" (${model.slug})`);

    // Seed colors as subcollection
    for (const color of model.colors) {
      console.log(`\n    ── Color: ${color.name} (${color.value}) ──`);

      const localDir = path.join(PUBLIC_DIR, 'bikes', model.name, color.folder);

      // Upload main image
      const mainLocalPath = path.join(localDir, 'main.avif');
      const mainStoragePath = `bikes/${model.slug}/${color.value}/main.avif`;
      const mainUrl = await uploadImage(mainLocalPath, mainStoragePath);

      // Upload front image
      const frontLocalPath = path.join(localDir, 'front.avif');
      const frontStoragePath = `bikes/${model.slug}/${color.value}/front.avif`;
      const frontUrl = await uploadImage(frontLocalPath, frontStoragePath);

      // Upload additional gallery images
      const additionalUrls: string[] = [];
      for (let i = 1; i <= color.galleryCount; i++) {
        const filename = `${i}.avif`;
        const galleryLocalPath = path.join(localDir, filename);
        const galleryStoragePath = `bikes/${model.slug}/${color.value}/${filename}`;
        const url = await uploadImage(galleryLocalPath, galleryStoragePath);
        additionalUrls.push(url);
      }

      // Write color document
      const colorDoc: Record<string, unknown> = {
        name: color.name,
        value: color.value,
        hex: color.hex,
        order: color.order,
        images: {
          main: mainUrl,
          front: frontUrl,
          additional: additionalUrls,
        },
        updatedAt: FieldValue.serverTimestamp(),
      };

      await db
        .collection('models')
        .doc(model.slug)
        .collection('colors')
        .doc(color.value)
        .set(colorDoc, { merge: true });

      console.log(`    ✔ Color document saved for ${color.name}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('🚀 Starting SuperTucan Firebase seed...\n');

  try {
    await seedCategories();
    await seedModels();
    console.log('\n✅ Seed completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

main();
