import { Hepsiburada, PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

class IntegrationService {
  private prisma = new PrismaClient();

  public async getHepsiburada(userId: number): Promise<Hepsiburada | Error> {
    try {
      const hepsiburadaData = await this.prisma.hepsiburada.findUnique({
        where: {
          userId
        }
      });

      if (!hepsiburadaData) throw new Error('Failed to get Hepsiburada data.');

      return hepsiburadaData;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  public async addHepsiburada(
    userId: number,
    data: Hepsiburada
  ): Promise<Hepsiburada | Error> {
    try {
      const hepsiburadaData = await this.prisma.hepsiburada
        .create({
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
        })
        .then(data => {
          return data;
        })
        .catch(() => {
          throw new Error(
            'The provided data conflicts with an existing record in the database'
          );
        });

      const {
        id,
        storeName,
        merchantId,
        integrationType,
        status,
        createdAt,
        updatedAt
      } = hepsiburadaData;

      await this.prisma.user.update({
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
      throw new Error(e.message);
    }
  }

  public async updateHepsiburada(
    userId: number,
    data: Hepsiburada
  ): Promise<Hepsiburada | Error> {
    try {
      const hepsiburadaData = await this.prisma.hepsiburada
        .update({
          where: {
            userId
          },
          data
        })
        .then(data => {
          return data;
        })
        .catch((e: PrismaClientKnownRequestError) => {
          throw new Error(e.meta?.cause as string);
        });

      if (!hepsiburadaData)
        throw new Error('Failed to update Hepsiburada data.');

      return hepsiburadaData;
    } catch (e: Error | any) {
      throw new Error(e.message);
    }
  }

  public async deleteHepsiburada(userId: number): Promise<Hepsiburada | Error> {
    try {
      const hepsiburadaData = await this.prisma.hepsiburada
        .delete({
          where: {
            userId
          }
        })
        .then(data => {
          return data;
        })
        .catch((e: PrismaClientKnownRequestError) => {
          throw new Error(e.meta?.cause as string);
        });

      if (!hepsiburadaData)
        throw new Error('Failed to create Hepsiburada data.');

      return hepsiburadaData;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}

export default IntegrationService;
