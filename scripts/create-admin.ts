import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  readFileSync(resolve(__dirname, 'service-account.json'), 'utf-8')
);

initializeApp({ credential: cert(serviceAccount) });

const auth = getAuth();

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Uso: pnpm create-admin <email> <password>');
  console.error('Ejemplo: pnpm create-admin admin@supertucan.com MiPassword123');
  process.exit(1);
}

if (password.length < 6) {
  console.error('Error: la contraseña debe tener al menos 6 caracteres');
  process.exit(1);
}

async function main() {
  try {
    // Verificar si el usuario ya existe
    try {
      const existing = await auth.getUserByEmail(email);
      console.log(`⚠️  El usuario ${email} ya existe (uid: ${existing.uid})`);

      // Asegurar que tenga el custom claim de admin
      await auth.setCustomUserClaims(existing.uid, { admin: true });
      console.log('✔ Custom claim "admin: true" asignado');
      return;
    } catch {
      // No existe, lo creamos
    }

    const user = await auth.createUser({
      email,
      password,
      displayName: 'Admin SuperTucán',
    });

    // Asignar custom claim para validar en Firestore rules
    await auth.setCustomUserClaims(user.uid, { admin: true });

    console.log('✅ Usuario admin creado:');
    console.log(`   Email: ${email}`);
    console.log(`   UID:   ${user.uid}`);
    console.log(`   Claim: admin=true`);
    console.log('');
    console.log(`Ahora puedes entrar a /admin con estas credenciales.`);
  } catch (err) {
    console.error('Error:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();
