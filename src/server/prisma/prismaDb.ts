import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const prismaDb = new PrismaClient().$extends(withAccelerate())