import { z } from 'zod';
import { IntegrationType, Status } from '@prisma/client';

const integrationTypeEnum = z.nativeEnum(IntegrationType);
type integrationTypeEnum = z.infer<typeof integrationTypeEnum>;

const statusEnum = z.nativeEnum(Status);
type statusEnum = z.infer<typeof statusEnum>;

const addHepsiburada = z
  .object({
    storeName: z
      .string()
      .nonempty({ message: 'Store Name must contain at least 1 character' }),
    merchantId: z
      .string()
      .nonempty({ message: 'Merchant ID must contain at least 1 character' }),
    integrationType: integrationTypeEnum.refine(
      val => {
        return (
          val === 'ERP' ||
          val === 'MARKETPLACE' ||
          val === 'SHIPMENT' ||
          val === 'ECOMMERCE' ||
          val === 'EINVOICE'
        );
      },
      { message: 'Integration Type is required' }
    ),
    status: statusEnum.refine(
      val => {
        return val === 'ACTIVE' || val === 'PASIVE';
      },
      { message: 'Status is required' }
    )
  })
  .required({
    storeName: true,
    merchantId: true,
    integrationType: true,
    status: true
  });

const updateHepsiburada = z
  .object({
    storeName: z
      .string()
      .nonempty({ message: 'Store Name must contain at least 1 character' }),
    merchantId: z
      .string()
      .nonempty({ message: 'Merchant ID must contain at least 1 character' }),
    status: statusEnum.optional().refine(
      val => {
        return val === 'ACTIVE' || val === 'PASIVE';
      },
      { message: 'Status is required' }
    )
  })
  .required({
    storeName: true,
    merchantId: true,
    status: true
  });

export default { addHepsiburada, updateHepsiburada };
