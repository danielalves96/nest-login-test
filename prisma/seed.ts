import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('12345678Ab!', 10);

  await prisma.user.create({
    data: {
      id: uuidv4(),
      enabled: true,
      profileImageUrl: '',
      lastSignInAt: null,
      banned: false,
      blocked: false,
      personId: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      password: await bcrypt.hash('defaultPassword123!', 10), // Adicionado
      usernames: {
        create: [
          {
            id: uuidv4(),
            username: 'daniel.alves',
            password,
            organizationId: uuidv4(),
          },
        ],
      },
    },
    include: {
      usernames: true,
    },
  });

  await prisma.user.create({
    data: {
      id: uuidv4(),
      enabled: true,
      profileImageUrl: '',
      lastSignInAt: null,
      banned: false,
      blocked: false,
      personId: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      password: await bcrypt.hash('defaultPassword123!', 10), // Adicionado
      usernames: {
        create: [
          {
            id: uuidv4(),
            username: 'paola.oliveira',
            password,
            organizationId: uuidv4(),
          },
        ],
      },
    },
    include: {
      usernames: true,
    },
  });

  await prisma.user.create({
    data: {
      id: uuidv4(),
      enabled: true,
      profileImageUrl: '',
      lastSignInAt: null,
      banned: false,
      blocked: false,
      personId: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      password: await bcrypt.hash('defaultPassword123!', 10), // Adicionado
      usernames: {
        create: [
          {
            id: uuidv4(),
            username: 'katia.werner',
            password,
            organizationId: uuidv4(),
          },
        ],
      },
    },
    include: {
      usernames: true,
    },
  });

  console.log('Seed data created');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
