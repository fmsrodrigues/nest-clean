import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Authenticate (E2E)', () => {
  let app: INestApplication, prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    const email = 'johndoe@example.com'
    const password = '123456'

    await prisma.user.create({
      data: {
        name: 'John Doe',
        email,
        password: await hash(password, 8),
      },
    })

    const res = await request(app.getHttpServer()).post('/sessions').send({
      email,
      password,
    })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
