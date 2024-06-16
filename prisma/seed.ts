import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('12345678Ab!', 10);
  const organizationId = uuidv4();

  const user1 = await prisma.user.create({
    data: {
      id: uuidv4(),
      password: hashedPassword,
      enabled: true,
      profileImageUrl: '',
      lastSignInAt: null,
      banned: false,
      blocked: false,
      personId: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      usernames: {
        create: [
          {
            id: uuidv4(),
            username: 'daniel.alves',
            organizationId: organizationId,
          },
          {
            id: uuidv4(),
            username: 'daniel.alves@printerdobrasil.com.br',
            organizationId: organizationId,
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: uuidv4(),
      password: hashedPassword,
      enabled: true,
      profileImageUrl: '',
      lastSignInAt: null,
      banned: false,
      blocked: false,
      personId: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      usernames: {
        create: [
          {
            id: uuidv4(),
            username: 'paola.oliveira',
            organizationId: organizationId,
          },
          {
            id: uuidv4(),
            username: 'paola.oliveira@printerdobrasil.com.br',
            organizationId: organizationId,
          },
        ],
      },
    },
  });

  const user3 = await prisma.user.create({
    data: {
      id: uuidv4(),
      password: hashedPassword,
      enabled: true,
      profileImageUrl: '',
      lastSignInAt: null,
      banned: false,
      blocked: false,
      personId: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      usernames: {
        create: [
          {
            id: uuidv4(),
            username: 'katia.werner',
            organizationId: organizationId,
          },
          {
            id: uuidv4(),
            username: 'katia.werner@printerdobrasil.com.br',
            organizationId: organizationId,
          },
        ],
      },
    },
  });

  const user4 = await prisma.user.create({
    data: {
      id: uuidv4(),
      password: hashedPassword,
      enabled: true,
      profileImageUrl: '',
      lastSignInAt: null,
      banned: false,
      blocked: false,
      personId: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      usernames: {
        create: [
          {
            id: uuidv4(),
            username: 'alan.rehfeldt',
            organizationId: organizationId,
          },
        ],
      },
    },
  });

  const user5 = await prisma.user.create({
    data: {
      id: uuidv4(),
      password: hashedPassword,
      enabled: true,
      profileImageUrl: '',
      lastSignInAt: null,
      banned: false,
      blocked: false,
      personId: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      usernames: {
        create: [
          {
            id: uuidv4(),
            username: 'mizael.jesus',
            organizationId: organizationId,
          },
        ],
      },
    },
  });

  const user6 = await prisma.user.create({
    data: {
      id: uuidv4(),
      password: hashedPassword,
      enabled: true,
      profileImageUrl: '',
      lastSignInAt: null,
      banned: false,
      blocked: false,
      personId: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      usernames: {
        create: [
          {
            id: uuidv4(),
            username: 'victor.matveichuk',
            organizationId: organizationId,
          },
        ],
      },
    },
  });

  console.log({ user1, user2, user3, user4, user5, user6 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
