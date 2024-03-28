import { PrismaClient } from '@prisma/client';
import { v4 } from 'uuid';
const prisma = new PrismaClient();
async function main() {
  const alice = await prisma.favs.upsert({
    where: { id: v4() },
    update: {},
    create: {
      id: v4(),
    },
  });
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
