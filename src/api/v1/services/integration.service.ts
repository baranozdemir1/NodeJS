import { Hepsiburada, PrismaClient } from '@prisma/client';

class IntegrationService {
  private integration = new PrismaClient().integration;
  private hepsiburada = new PrismaClient().hepsiburada;
  private user = new PrismaClient().user;

  public async addHepsiburada(
    userId: number,
    data: Hepsiburada
  ): Promise<Hepsiburada | Error> {
    try {
      const hepsiburadaData = await this.hepsiburada.create({
        data: {
          storeName: data.storeName,
          merchantId: data.merchantId,
          integrationType: data.integrationType,
          status: data.status,
          Integration: {
            connectOrCreate: {
              where: { userId },
              create: {
                User: {
                  connect: { id: userId }
                }
              }
            }
          },
          User: {
            connect: { id: userId }
          }
        },
        include: {
          Integration: true
        }
      });

      if (!hepsiburadaData)
        throw new Error('Failed to create Hepsiburada data.');

      const {
        id,
        storeName,
        merchantId,
        integrationType,
        status,
        createdAt,
        updatedAt
      } = hepsiburadaData;

      await this.user.update({
        where: {
          id: userId
        },
        data: {
          integrationId: hepsiburadaData.Integration[0].id
        }
      });

      return {
        id,
        storeName,
        merchantId,
        integrationType,
        status,
        userId,
        createdAt,
        updatedAt
      };
    } catch (e: any) {
      throw new Error(e);
    }
  }
}

export default IntegrationService;
