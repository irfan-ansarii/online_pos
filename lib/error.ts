import { Prisma } from "@prisma/client";

export function prismaError({
  message,
  status,
  details,
}: {
  message: string;
  status: number;
  details?: any;
}) {
  const error = new Error(message);
  error.status = status;
  error.details = details;
  throw error;
}

export function handlePrismaError(error: any) {
  console.log(error.message);
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return prismaError({
      message: error.message,
      status: 400,
      details: error.message,
    });
  }
  if (error instanceof Prisma.PrismaClientValidationError) {
    return prismaError({
      message: "Validation failed",
      status: 400,
      details: error.message,
    });
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return prismaError({
      message: "Incorrect database credentials",
      status: 500,
    });
  }
  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return prismaError({
      message: "Internal server error",
      status: 500,
    });
  }
  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return prismaError({
      message: "Something went wrong",
      status: 500,
      details: error.message,
    });
  }

  return prismaError({
    message: "Cant reach database server",
    status: 500,
    details: error.message,
  });
}
