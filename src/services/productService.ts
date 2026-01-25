import type { Product } from "@prisma/client";

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt"> & {
  collectionSlug?: string | null;
};

const jsonHeaders = { "Content-Type": "application/json" };

export type UploadResult = { secureUrl: string; publicId: string };

export async function uploadImage(source: string) {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ url: source, folder: "products" }),
  });
  await assertOk(res);
  return (await res.json()) as UploadResult;
}

const assertOk = async (res: Response) => {
  if (res.ok) return res;

  const clone = res.clone();
  // Try JSON first
  try {
    const data = await res.json();
    const message = (data as { error?: string; message?: string })?.error ?? (data as { message?: string }).message;
    throw new Error(message || `${res.status} ${res.statusText}`);
  } catch {
    // Fallback to text from the clone (body not consumed)
    const text = await clone.text();
    throw new Error(text || `${clone.status} ${clone.statusText}`);
  }
};

export async function getProducts(): Promise<Product[]> {
  const res = await fetch("/api/products", { cache: "no-store" });
  await assertOk(res);
  return (await res.json()) as Product[];
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(input),
  });
  await assertOk(res);
  return (await res.json()) as Product;
}

export async function updateProduct(id: string, input: ProductInput) {
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(input),
  });
  await assertOk(res);
  return (await res.json()) as Product;
}

export async function deleteProduct(id: string) {
  const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
  await assertOk(res);
  return id;
}
