// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('12345678Ab!', 10);

  let organization = await prisma.organization.findUnique({
    where: { identificationDocument: '123456789' },
  });

  if (!organization) {
    organization = await prisma.organization.create({
      data: {
        name: 'Printer do Brasil',
        identificationDocument: '123456789',
        subdomain: 'printerdobrasil',
        email: 'contact@printerdobrasil.com',
        phone: '1234567890',
        contactName: 'Contact Name',
        contactPhone: '1234567890',
      },
    });
  }

  let user = await prisma.user.findUnique({
    where: { email: 'admin@printerdobrasil.com' },
  });

  if (!user) {
    const now = Math.floor(Date.now() / 1000); // Convertendo para segundos
    user = await prisma.user.create({
      data: {
        username: 'admin',
        name: 'Administrador',
        password: hashedPassword,
        identificationDocument: '987654321',
        email: 'admin@printerdobrasil.com',
        enabled: true,
        lastActiveAt: now,
        createdAt: now,
        updatedAt: now,
        userOrganization: {
          create: {
            organizationId: organization.id,
          },
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
