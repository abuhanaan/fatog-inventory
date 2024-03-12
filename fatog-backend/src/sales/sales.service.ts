import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { Prisma, Sales } from '@prisma/client';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  private checkIfSalesExists(sales: Sales, id: number) {
    if (!sales) {
      throw new NotFoundException({
        message: `Invoice with id ${id} does not exist`,
        error: 'Not Found',
      });
    }
  }

  async create(createSaleDto: CreateSaleDto, user: UserEntity) {
    const staff = await this.prisma.staff.findFirst({
      where: { staffId: user.id },
    });

    if (!staff) {
      throw new UnauthorizedException({
        message: 'You are not authorized to perform this operation',
        error: 'Unauthorized Operation',
      });
    }

    const order = await this.prisma.order.findUnique({
      where: { refId: createSaleDto.orderRefId },
    });

    if (!order) {
      throw new NotFoundException({
        message: `Order with id ${createSaleDto.orderRefId} does not exist`,
        error: 'Not Found',
      });
    }

    // Fetch order items
    const orderItems = await this.prisma.orderList.findMany({
      where: { orderRefId: createSaleDto.orderRefId },
    });

    // Calculate payable and outstanding amounts
    const amountPayable = order.totalAmount;
    const outStandingPayment = amountPayable - createSaleDto.amountPaid;

    // Initialize an array to store promises for transaction operations
    const transactionOperations = [];

    try {
      // Update inventory and record history for each order item
      for (const orderItem of orderItems) {
        const inventory = await this.prisma.inventory.findFirst({
          where: { productRefId: orderItem.productRefId },
        });

        if (!inventory) {
          throw new NotFoundException({
            message: `Inventory not found for product ID ${orderItem.productRefId}`,
            error: 'Not Found',
          });
        }

        // Push each operation into the array
        transactionOperations.push(
          this.prisma.inventory.update({
            where: { id: inventory.id },
            data: { remainingQty: { decrement: orderItem.noOfBags } },
          }),
          this.prisma.inventoryHistory.create({
            data: {
              inventoryId: inventory.id,
              orderItemId: orderItem.id,
              stockItemRefId: null,
              remainderBefore: inventory.remainingQty,
              remainderAfter: inventory.remainingQty - orderItem.noOfBags,
              effectQuantity: orderItem.noOfBags,
              increment: false,
              decrement: true,
            },
          }),
        );
      }

      // Create sales record
      const sales = await this.prisma.sales.create({
        data: {
          ...createSaleDto,
          amountPayable,
          outStandingPayment,
          cashierId: staff.id,
        },
      });

      // Push sales creation into transaction operations
      transactionOperations.push(sales);

      // Start the transaction with the array of promises
      await this.prisma.$transaction(transactionOperations);

      return sales;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        message:
          'Failed to create sales and other corresponding inventory update',
        error: 'Internal Server Error',
      }); // Let the global error handler manage the error
    }
  }

  async create2(createSaleDto: CreateSaleDto, user: UserEntity) {
    const staff = await this.prisma.staff.findFirst({
      where: { staffId: user.id },
    });

    if (!staff) {
      throw new UnauthorizedException({
        message: 'You are not authorized to perform this operation',
        error: 'Unauthorized Operation',
      });
    }

    const order = await this.prisma.order.findUnique({
      where: { refId: createSaleDto.orderRefId },
    });

    if (!order) {
      throw new NotFoundException({
        message: `Order with id ${createSaleDto.orderRefId} does not exist`,
        error: 'Not Found',
      });
    }

    // Fetch order items
    const orderItems = await this.prisma.orderList.findMany({
      where: { orderRefId: createSaleDto.orderRefId },
    });

    // Calculate payable and outstanding amounts
    const amountPayable = order.totalAmount;
    const outStandingPayment = amountPayable - createSaleDto.amountPaid;

    try {
      // Start a Prisma transaction
      const transaction = await this.prisma.$transaction(async (prisma) => {
        // Update inventory and record history for each order item
        for (const orderItem of orderItems) {
          const inventory = await prisma.inventory.findFirst({
            where: { productRefId: orderItem.productRefId },
          });

          if (!inventory) {
            throw new NotFoundException({
              message: `Inventory not found for product ID ${orderItem.productRefId}`,
              error: 'Not Found',
            });
          }

          // Update inventory
          await prisma.inventory.update({
            where: { id: inventory.id },
            data: { remainingQty: { decrement: orderItem.noOfBags } },
          });

          // Create inventory history
          await prisma.inventoryHistory.create({
            data: {
              inventoryId: inventory.id,
              orderItemId: orderItem.id,
              stockItemRefId: null,
              remainderBefore: inventory.remainingQty,
              remainderAfter: inventory.remainingQty - orderItem.noOfBags,
              effectQuantity: orderItem.noOfBags,
              increment: false,
              decrement: true,
            },
          });
        }

        // Create sales record
        const sales = await prisma.sales.create({
          data: {
            ...createSaleDto,
            amountPayable,
            outStandingPayment,
            cashierId: staff.id,
          },
        });

        return sales;
      });

      return transaction;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        message:
          'Failed to create sales and other corresponding inventory update',
        error: 'Internal Server Error',
      }); // Let the global error handler manage the error
    }
  }

  async create3(createSaleDto: CreateSaleDto, user: UserEntity) {
    const staff = await this.prisma.staff.findFirst({
      where: { staffId: user.id },
    });

    if (!staff) {
      throw new UnauthorizedException({
        message: 'You are not authorized to perform this operation',
        error: 'Unauthorized Operation',
      });
    }

    const order = await this.prisma.order.findUnique({
      where: { refId: createSaleDto.orderRefId },
    });

    if (!order) {
      throw new NotFoundException({
        message: `Order with id ${createSaleDto.orderRefId} does not exist`,
        error: 'Not Found',
      });
    }

    // Fetch order items
    const orderItems = await this.prisma.orderList.findMany({
      where: { orderRefId: createSaleDto.orderRefId },
    });

    // Calculate payable and outstanding amounts
    const amountPayable = order.totalAmount;
    const outStandingPayment = amountPayable - createSaleDto.amountPaid;

    // Prepare arrays for batch operations
    const inventoryUpdateData = [];
    const inventoryHistoryData = [];

    for (const orderItem of orderItems) {
      const inventory = await this.prisma.inventory.findFirst({
        where: { productRefId: orderItem.productRefId },
      });

      if (!inventory) {
        throw new NotFoundException({
          message: `Inventory not found for product ID ${orderItem.productRefId}`,
          error: 'Not Found',
        });
      }

      // Prepare data for inventory update
      inventoryUpdateData.push({
        where: { id: inventory.id },
        data: { remainingQty: { decrement: orderItem.noOfBags } },
      });

      // Prepare data for inventory history creation
      inventoryHistoryData.push({
        inventoryId: inventory.id,
        orderItemId: orderItem.id,
        stockItemId: null,
        remainderBefore: inventory.remainingQty,
        remainderAfter: inventory.remainingQty - orderItem.noOfBags,
        effectQuantity: orderItem.noOfBags,
        increment: false,
        decrement: true,
      });
    }

    try {
      // Batch update inventory quantities
      // await this.prisma.inventory.updateMany({
      //   data: inventoryUpdateData,
      // });

      // // Create inventory history records
      // await this.prisma.inventoryHistory.createMany({
      //   data: inventoryHistoryData,
      // });

      // // Create sales record
      // const sales = await this.prisma.sales.create({
      //   data: {
      //     ...createSaleDto,
      //     amountPayable,
      //     outStandingPayment,
      //     cashierId: staff.id,
      //   },
      // });

      const transaction = await this.prisma.$transaction([
        this.prisma.inventory.updateMany({
          data: inventoryUpdateData,
        }),
        this.prisma.inventoryHistory.createMany({
          data: inventoryHistoryData,
        }),
        this.prisma.sales.create({
          data: {
            ...createSaleDto,
            amountPayable,
            outStandingPayment,
            cashierId: staff.id,
          },
        }),
      ]);

      return transaction[2];
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Failed to create sales and update corresponding inventory',
        error: 'Internal Server Error',
      }); // Let the global error handler manage the error
    }
  }

  findAll() {
    return this.prisma.sales.findMany({
      include: { order: true, staff: true },
    });
  }

  async findOne(id: number) {
    const sales = await this.prisma.sales.findUnique({
      where: { id },
      include: { order: true, staff: true },
    });
    this.checkIfSalesExists;
    return sales;
  }

  async update(id: number, updateSaleDto: UpdateSaleDto, user: UserEntity) {
    const sales = await this.prisma.sales.findUnique({
      where: { id },
    });
    this.checkIfSalesExists;
    return this.prisma.sales.update({ where: { id }, data: updateSaleDto });
  }

  async remove(id: number) {
    // Find the sales record
    const sales = await this.prisma.sales.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            orderLists: true,
          },
        },
      },
    });

    // Check if the sales record exists
    this.checkIfSalesExists(sales, id);

    // Initialize an empty array to store promises for transaction operations
    const transactionOperations: Prisma.PrismaPromise<any>[] = [];

    try {
      // Reverse the effects of the sales record on inventory and inventory history
      await Promise.all(
        sales.order.orderLists.map(async (orderItem) => {
          const inventory = await this.prisma.inventory.findFirst({
            where: { productRefId: orderItem.productRefId },
          });
          if (!inventory) {
            throw new NotFoundException({
              message: `Inventory not found for product ID ${orderItem.productRefId}`,
              error: 'Not Found',
            });
          }

          // Push each operation into the array
          transactionOperations.push(
            this.prisma.inventory.update({
              where: { id: inventory.id },
              data: { remainingQty: { increment: orderItem.noOfBags } },
            }),
            this.prisma.inventoryHistory.create({
              data: {
                inventoryId: inventory.id,
                orderItemId: orderItem.id,
                stockItemRefId: null,
                remainderBefore: inventory.remainingQty,
                remainderAfter: inventory.remainingQty + orderItem.noOfBags,
                effectQuantity: orderItem.noOfBags,
                increment: true,
                decrement: false,
              },
            }),
          );
        }),
      );

      // Remove the sales record
      transactionOperations.push(
        this.prisma.sales.delete({
          where: { id },
        }),
      );

      // Start the transaction with the array of promises
      await this.prisma.$transaction(transactionOperations);

      return `Sale with id ${id} has been removed, and its effects on inventory have been reversed.`;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        message: `Something went wrong and sales with id ${id} could not be deleted`,
        error: 'Internal Server Error',
      });
    }
  }
}
