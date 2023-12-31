import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create account (E2E)', () => {
  let app: INestApplication, prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /accounts', async () => {
    const email = 'johndoe@example.com'

    const res = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email,
      password: '123456',
    })

    expect(res.status).toBe(201)

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    expect(user).toBeTruthy()
  })
})
