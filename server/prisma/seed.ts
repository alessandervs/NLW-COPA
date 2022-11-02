import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      avatarUrl: 'https://github.com/alessandervs.png'
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Example',
      code: 'DOE123',
      ownerId: user.id,

      participant: {
        create: {
          userId: user.id
        }
      }

    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-02T12:00:43.298Z',
      firsTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR'
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-03T12:00:43.298Z',
      firsTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  })

}

main()