import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

//Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `$${int}.00`;
}

//Format errors
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  // Prefer name/code when available, but don't assume shapes
  if (error?.name === "ZodError") {
    const issues = Array.isArray(error.issues) ? error.issues : [];
    if (issues.length > 0) {
      // Example: "shippingPrice: Price must have exactly two decimal places"

      return (
        issues
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((i: any) => {
            const path =
              Array.isArray(i.path) && i.path.length ? i.path.join(".") : "";
            return path ? `${path}: ${i.message}` : i.message;
          })
          .join("\n")
      );
    }
    // Fallback for odd Zod shapes
    return typeof error.message === "string"
      ? error.message
      : "Validation error";
  }

  if (
    error?.name === "PrismaClientKnownRequestError" &&
    error?.code === "P2002"
  ) {
    const field = error.meta?.target?.[0] ?? "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  return typeof error?.message === "string"
    ? error.message
    : JSON.stringify(error?.message ?? "Unknown error");
}

// Round number to 2 decimal places
export function roundToTwoDecimalPlaces(value: number | string) {
  if (typeof value === "number") {
    // Number.epsilon helps avoid floating point arithmetic issues
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return (Math.round(Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Value is not a number or string");
  }
}
