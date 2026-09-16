import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.resolve(currentDirectory, "../src/data");

interface ProductSeed {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: { rate?: number; count?: number };
}

interface UserSeed {
  id: number;
  username: string;
  email: string;
  passwordHash?: string;
  password?: string;
}

interface OrderItemSeed {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface OrderSeed {
  id: string;
  userId: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: OrderItemSeed[];
  total: number;
  status: string;
  createdAt: string;
}

async function readSeedFile<T>(fileName: string): Promise<T> {
  const content = await readFile(path.join(dataDirectory, fileName), "utf8");
  return JSON.parse(content) as T;
}

async function seedUsers(users: UserSeed[]) {
  for (const user of users) {
    const passwordHash = user.passwordHash || await bcrypt.hash(user.password || "change-me", 10);
    await prisma.user.upsert({
      where: { id: user.id },
      update: { username: user.username, email: user.email, passwordHash },
      create: {
        id: user.id,
        username: user.username,
        email: user.email,
        passwordHash,
      },
    });
  }
}

async function seedProducts(products: ProductSeed[]) {
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        ratingRate: product.rating?.rate ?? 0,
        ratingCount: product.rating?.count ?? 0,
      },
      create: {
        id: product.id,
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        ratingRate: product.rating?.rate ?? 0,
        ratingCount: product.rating?.count ?? 0,
      },
    });
  }
}

async function seedOrders(orders: OrderSeed[]) {
  for (const order of orders) {
    await prisma.order.upsert({
      where: { id: order.id },
      update: {
        userId: order.userId,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        customerPhone: order.customer.phone,
        customerAddress: order.customer.address,
        total: order.total,
        status: order.status,
        createdAt: new Date(order.createdAt),
      },
      create: {
        id: order.id,
        userId: order.userId,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        customerPhone: order.customer.phone,
        customerAddress: order.customer.address,
        total: order.total,
        status: order.status,
        createdAt: new Date(order.createdAt),
      },
    });

    for (const item of order.items) {
      await prisma.orderItem.upsert({
        where: {
          orderId_productId: {
            orderId: order.id,
            productId: item.productId,
          },
        },
        update: {
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
        },
        create: {
          orderId: order.id,
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
        },
      });
    }
  }
}

async function main() {
  const users = await readSeedFile<UserSeed[]>("users.json");
  const products = await readSeedFile<ProductSeed[]>("products.json");
  const orders = await readSeedFile<OrderSeed[]>("orders.json");

  await prisma.$transaction(async (transaction) => {
    for (const user of users) {
      const passwordHash = user.passwordHash || await bcrypt.hash(user.password || "change-me", 10);
      await transaction.user.upsert({
        where: { id: user.id },
        update: { username: user.username, email: user.email, passwordHash },
        create: { id: user.id, username: user.username, email: user.email, passwordHash },
      });
    }
    for (const product of products) {
      await transaction.product.upsert({
        where: { id: product.id },
        update: {
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image,
          ratingRate: product.rating?.rate ?? 0,
          ratingCount: product.rating?.count ?? 0,
        },
        create: {
          id: product.id,
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image,
          ratingRate: product.rating?.rate ?? 0,
          ratingCount: product.rating?.count ?? 0,
        },
      });
    }
    for (const order of orders) {
      await transaction.order.upsert({
        where: { id: order.id },
        update: {
          userId: order.userId,
          customerName: order.customer.name,
          customerEmail: order.customer.email,
          customerPhone: order.customer.phone,
          customerAddress: order.customer.address,
          total: order.total,
          status: order.status,
          createdAt: new Date(order.createdAt),
        },
        create: {
          id: order.id,
          userId: order.userId,
          customerName: order.customer.name,
          customerEmail: order.customer.email,
          customerPhone: order.customer.phone,
          customerAddress: order.customer.address,
          total: order.total,
          status: order.status,
          createdAt: new Date(order.createdAt),
        },
      });
      for (const item of order.items) {
        await transaction.orderItem.upsert({
          where: { orderId_productId: { orderId: order.id, productId: item.productId } },
          update: { title: item.title, price: item.price, quantity: item.quantity, subtotal: item.subtotal },
          create: {
            orderId: order.id,
            productId: item.productId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal,
          },
        });
      }
    }
  });

  const [userCount, productCount, orderCount, itemCount] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.orderItem.count(),
  ]);
  console.log(JSON.stringify({ userCount, productCount, orderCount, itemCount }));
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
