"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TabsNav } from "@/components/TabsNav";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  uploadImage,
  type ProductInput,
} from "@/services/productService";
import type { Product } from "@prisma/client";

const ADMIN_NAME = "admin";
const ADMIN_PASSWORD = "1234";

const emptyProduct: ProductInput = {
  title: "",
  description: "",
  price: "",
  image: "",
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginValues, setLoginValues] = useState({ name: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [formValues, setFormValues] = useState<ProductInput>(emptyProduct);
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, ProductInput>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    setListLoading(true);
    getProducts()
      .then((items) => setProducts(items))
      .finally(() => setListLoading(false));
  }, [isAuthenticated]);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      loginValues.name.trim() === ADMIN_NAME &&
      loginValues.password === ADMIN_PASSWORD
    ) {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Bilgiler eşleşmedi. Lütfen tekrar deneyin.");
    }
  };

  const resetForm = () => {
    setFormValues(emptyProduct);
    setFormError("");
  };

  const isFormInvalid = useMemo(
    () =>
      !formValues.title.trim() ||
      !formValues.description.trim() ||
      !formValues.price.trim() ||
      !formValues.image.trim(),
    [formValues]
  );

  const handleAdd = async () => {
    if (isFormInvalid) {
      setFormError("Tüm alanlar zorunlu.");
      return;
    }
    setFormError("");
    setUploading(true);
    setSavingId("new");
    let imageUrl = formValues.image.trim();

    try {
      const upload = await uploadImage(imageUrl);
      imageUrl = upload.secureUrl;

      const created = await createProduct({
        ...formValues,
        image: imageUrl,
      });
      setProducts((prev) => [...prev, created]);
      resetForm();
    } catch (error) {
      setFormError((error as Error).message || "Görsel yüklenemedi.");
    } finally {
      setSavingId(null);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSavingId(id);
    await deleteProduct(id);
    setProducts((prev) => prev.filter((product) => product.id !== id));
    setSavingId(null);
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setDrafts((prev) => ({
      ...prev,
      [product.id]: {
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image,
      },
    }));
  };

  const handleSave = async (id: string) => {
    const draft = drafts[id];
    if (
      !draft.title.trim() ||
      !draft.description.trim() ||
      !draft.price.trim() ||
      !draft.image.trim()
    ) {
      setFormError("Tüm alanlar zorunlu.");
      return;
    }
    setSavingId(id);
    setUploading(true);
    let imageUrl = draft.image.trim();
    try {
      const upload = await uploadImage(imageUrl);
      imageUrl = upload.secureUrl;

      const updated = await updateProduct(id, {
        ...draft,
        image: imageUrl,
      });
      setProducts((prev) =>
        prev.map((product) => (product.id === id ? updated : product))
      );
      setEditingId(null);
    } catch (error) {
      setFormError((error as Error).message || "Görsel yüklenemedi.");
    } finally {
      setSavingId(null);
      setUploading(false);
    }
  };

  const renderList = () => {
    if (listLoading) {
      return (
        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner"
            >
              <div className="grid grid-cols-5 gap-3">
                <div className="col-span-2 h-10 animate-pulse rounded bg-white/10" />
                <div className="col-span-2 h-10 animate-pulse rounded bg-white/10" />
                <div className="h-10 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!products.length) {
      return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-200">
          Henüz ürün yok. Yukarıdan ekleyebilirsiniz.
        </div>
      );
    }

    return (
      <div className="grid gap-3">
        {products.map((product) => {
          const isEditing = editingId === product.id;
          const draft = drafts[product.id] ?? product;

          return (
            <div
              key={product.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner"
            >
              <div className="grid gap-3 sm:grid-cols-[1.3fr,2fr,0.8fr,1fr,auto,auto]">
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) =>
                    setDrafts((prev) => ({
                      ...prev,
                      [product.id]: { ...draft, title: e.target.value },
                    }))
                  }
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/50 disabled:opacity-70"
                />
                <input
                  type="text"
                  value={draft.description}
                  onChange={(e) =>
                    setDrafts((prev) => ({
                      ...prev,
                      [product.id]: { ...draft, description: e.target.value },
                    }))
                  }
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/50 disabled:opacity-70"
                />
                <input
                  type="text"
                  value={draft.price}
                  onChange={(e) =>
                    setDrafts((prev) => ({
                      ...prev,
                      [product.id]: { ...draft, price: e.target.value },
                    }))
                  }
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/50 disabled:opacity-70"
                />
                <input
                  type="text"
                  value={draft.image}
                  onChange={(e) =>
                    setDrafts((prev) => ({
                      ...prev,
                      [product.id]: { ...draft, image: e.target.value },
                    }))
                  }
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/50 disabled:opacity-70"
                />
                <button
                  type="button"
                  onClick={() =>
                    isEditing ? handleSave(product.id) : startEdit(product)
                  }
                  disabled={savingId === product.id || uploading || !isEditing}
                  className={`flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    isEditing
                      ? "bg-amber-400 text-slate-950 hover:-translate-y-0.5"
                      : "border border-white/20 bg-white/10 text-white hover:-translate-y-0.5"
                  } ${savingId === product.id || uploading ? "opacity-60" : ""}`}
                >
                  {isEditing ? "Kaydet" : "Düzenle"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(product.id)}
                  disabled={savingId === product.id || uploading}
                  className="flex h-full items-center justify-center rounded-xl border border-red-400/40 bg-red-500/20 px-3 py-2 text-lg font-bold text-red-100 transition hover:-translate-y-0.5 disabled:opacity-60"
                  aria-label={`${product.title} sil`}
                >
                  -
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#e9b76d] text-[#2c1a0c]">
      <Header />
      <div className="py-5 sm:py-6">
        <TabsNav />
      </div>
      <main className="flex flex-1 px-4 pb-10 sm:pb-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 rounded-3xl border border-[#6b3f1f]/30 bg-[#f3d89b] px-5 py-8 shadow-2xl sm:px-8 sm:py-10 lg:px-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#6b3f1f]">
                Admin panel
              </p>
              <h1 className="text-3xl font-semibold sm:text-4xl">
                Ürün yönetimi
              </h1>
            </div>
           
          </div>

          {!isAuthenticated ? (
            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-4 rounded-2xl border border-[#6b3f1f]/30 bg-white/50 p-5 shadow-inner sm:flex-row sm:items-end sm:gap-6"
            >
              <label className="flex flex-1 flex-col gap-2 text-sm font-medium text-[#2c1a0c]">
                İsim
                <input
                  type="text"
                  value={loginValues.name}
                  onChange={(e) =>
                    setLoginValues((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="rounded-xl border border-[#6b3f1f]/30 bg-white/70 px-4 py-3 text-[#2c1a0c] placeholder:text-[#72552e] focus:border-[#6b3f1f] focus:outline-none focus:ring-2 focus:ring-[#6b3f1f]/40"
                  placeholder="username"
                />
              </label>
              <label className="flex flex-1 flex-col gap-2 text-sm font-medium text-[#2c1a0c]">
                Şifre
                <input
                  type="password"
                  value={loginValues.password}
                  onChange={(e) =>
                    setLoginValues((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="rounded-xl border border-[#6b3f1f]/30 bg-white/70 px-4 py-3 text-[#2c1a0c] placeholder:text-[#72552e] focus:border-[#6b3f1f] focus:outline-none focus:ring-2 focus:ring-[#6b3f1f]/40"
                  placeholder="password"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-xl bg-[#6b3f1f] px-5 py-3 text-center text-base font-semibold text-[#f8edd8] shadow-lg shadow-[#6b3f1f]/40 transition hover:-translate-y-0.5 hover:shadow-[#6b3f1f]/60 sm:w-auto"
              >
                Giriş Yap
              </button>
              {loginError && (
                <p className="sm:-mb-1 text-sm font-medium text-red-200">
                  {loginError}
                </p>
              )}
            </form>
          ) : (
            <>
              <div className="rounded-2xl border border-[#6b3f1f]/40 bg-[#f1d48d] p-5 shadow-inner">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
                  <label className="flex flex-1 flex-col gap-2 text-sm font-medium text-[#2c1a0c]">
                    Başlık
                    <input
                      type="text"
                      value={formValues.title}
                      onChange={(e) =>
                        setFormValues((prev) => ({ ...prev, title: e.target.value }))
                      }
                      className="rounded-xl border border-[#6b3f1f]/30 bg-white/70 px-4 py-3 text-[#2c1a0c] placeholder:text-[#72552e] focus:border-[#6b3f1f] focus:outline-none focus:ring-2 focus:ring-[#6b3f1f]/40"
                      placeholder="Ürün adı"
                    />
                  </label>
                  <label className="flex flex-[1.4] flex-col gap-2 text-sm font-medium text-[#2c1a0c]">
                    Açıklama
                    <input
                      type="text"
                      value={formValues.description}
                      onChange={(e) =>
                        setFormValues((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="rounded-xl border border-[#6b3f1f]/30 bg-white/70 px-4 py-3 text-[#2c1a0c] placeholder:text-[#72552e] focus:border-[#6b3f1f] focus:outline-none focus:ring-2 focus:ring-[#6b3f1f]/40"
                      placeholder="Kısa açıklama"
                    />
                  </label>
                  <label className="flex flex-[0.7] flex-col gap-2 text-sm font-medium text-[#2c1a0c]">
                    Fiyat
                    <input
                      type="text"
                      value={formValues.price}
                      onChange={(e) =>
                        setFormValues((prev) => ({ ...prev, price: e.target.value }))
                      }
                      className="rounded-xl border border-[#6b3f1f]/30 bg-white/70 px-4 py-3 text-[#2c1a0c] placeholder:text-[#72552e] focus:border-[#6b3f1f] focus:outline-none focus:ring-2 focus:ring-[#6b3f1f]/40"
                      placeholder="0 TL"
                    />
                  </label>
                  <label className="flex flex-1 flex-col gap-2 text-sm font-medium text-[#2c1a0c]">
                    Görsel URL
                    <input
                      type="text"
                      value={formValues.image}
                      onChange={(e) =>
                        setFormValues((prev) => ({ ...prev, image: e.target.value }))
                      }
                      className="rounded-xl border border-[#6b3f1f]/30 bg-white/70 px-4 py-3 text-[#2c1a0c] placeholder:text-[#72552e] focus:border-[#6b3f1f] focus:outline-none focus:ring-2 focus:ring-[#6b3f1f]/40"
                      placeholder="Doğrudan görsel URL veya base64 data"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={savingId === "new" || isFormInvalid || uploading}
                    className="mt-2 flex h-[52px] items-center justify-center rounded-xl bg-[#6b3f1f] px-4 text-2xl font-bold text-[#f8edd8] shadow-lg shadow-[#6b3f1f]/40 transition hover:-translate-y-0.5 hover:shadow-[#6b3f1f]/60 sm:mt-0 sm:px-5 disabled:opacity-60"
                    aria-label="Ürün ekle"
                  >
                    +
                  </button>
                </div>
                {formError && (
                  <p className="mt-3 text-sm font-medium text-red-100">{formError}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm text-[#3b2414]">
                  <p>Eklenen ürünler</p>
                  <span className="rounded-full bg-[#6b3f1f]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#6b3f1f]">
                    {products.length} ürün
                  </span>
                </div>
                {renderList()}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
