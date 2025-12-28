"use client";

import {
  DragEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

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

const ADMIN_NAME = "berkayfrt";
const ADMIN_PASSWORD = "1997";
const allowedImageTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const emptyProduct: ProductInput = {
  title: "",
  description: "",
  price: "",
  image: "",
};

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Gorsel okunamadi, tekrar deneyin."));
    reader.readAsDataURL(file);
  });

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
  const [draftImageNames, setDraftImageNames] = useState<Record<string, string>>(
    {}
  );
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDraggingNew, setIsDraggingNew] = useState(false);
  const [createImageName, setCreateImageName] = useState("");

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
      setLoginError("Bilgiler eslesmedi. Lutfen tekrar deneyin.");
    }
  };

  const resetForm = () => {
    setFormValues(emptyProduct);
    setFormError("");
    setCreateImageName("");
    setIsDraggingNew(false);
  };

  const isFormInvalid = useMemo(
    () =>
      !formValues.title.trim() ||
      !formValues.description.trim() ||
      !formValues.price.trim() ||
      !formValues.image.trim(),
    [formValues]
  );

  const validateFile = (file: File) => {
    if (!allowedImageTypes.has(file.type)) {
      throw new Error("Sadece JPEG, JPG, PNG veya WebP dosyalari yukleyin.");
    }
  };

  const handleFileForNew = async (file: File) => {
    try {
      validateFile(file);
      const dataUrl = await fileToDataUrl(file);
      setFormValues((prev) => ({ ...prev, image: dataUrl }));
      setCreateImageName(file.name);
      setFormError("");
    } catch (error) {
      setFormError((error as Error).message || "Gorsel islenemedi.");
    } finally {
      setIsDraggingNew(false);
    }
  };

  const handleFileForDraft = async (product: Product, file: File) => {
    try {
      validateFile(file);
      const dataUrl = await fileToDataUrl(file);
      setDrafts((prev) => ({
        ...prev,
        [product.id]: { ...(prev[product.id] ?? product), image: dataUrl },
      }));
      setDraftImageNames((prev) => ({ ...prev, [product.id]: file.name }));
      setFormError("");
    } catch (error) {
      setFormError((error as Error).message || "Gorsel islenemedi.");
    }
  };

  const onDropNew = async (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      await handleFileForNew(file);
    } else {
      setIsDraggingNew(false);
    }
  };

  const onDragOverNew = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDraggingNew(true);
  };

  const onDragLeaveNew = () => setIsDraggingNew(false);

  const handleAdd = async () => {
    if (isFormInvalid) {
      setFormError("Tum alanlar zorunlu.");
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
      setFormError((error as Error).message || "Gorsel yuklenemedi.");
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
    setDraftImageNames((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
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
    setDraftImageNames((prev) => {
      const next = { ...prev };
      delete next[product.id];
      return next;
    });
  };

  const handleSave = async (id: string) => {
    const draft = drafts[id] ?? products.find((product) => product.id === id);
    if (!draft) {
      setFormError("Bu urun bulunamadi.");
      return;
    }
    if (
      !draft.title.trim() ||
      !draft.description.trim() ||
      !draft.price.trim() ||
      !draft.image.trim()
    ) {
      setFormError("Tum alanlar zorunlu.");
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
      setDraftImageNames((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (error) {
      setFormError((error as Error).message || "Gorsel yuklenemedi.");
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
          Henuz urun yok. Yukaridan ekleyebilirsiniz.
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
              <div className="grid gap-3 sm:grid-cols-[1.3fr,2fr,0.8fr,1.3fr,auto,auto]">
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
                <div
                  className="space-y-2"
                  onDragOver={(e) => {
                    if (!isEditing) return;
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    if (!isEditing) return;
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      handleFileForDraft(product, file);
                    }
                  }}
                >
                  <input
                    type="text"
                    value={draft.image}
                    onChange={(e) => {
                      setDraftImageNames((prev) => {
                        const next = { ...prev };
                        delete next[product.id];
                        return next;
                      });
                      setDrafts((prev) => ({
                        ...prev,
                        [product.id]: { ...draft, image: e.target.value },
                      }));
                    }}
                    disabled={!isEditing}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/50 disabled:opacity-70"
                    placeholder="URL veya data"
                  />
                  <label
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                      isEditing
                        ? "cursor-pointer border-white/30 text-white hover:border-amber-200 hover:text-amber-100"
                        : "cursor-not-allowed border-white/10 text-slate-400"
                    }`}
                  >
                    <input
                      type="file"
                      accept=".jpeg,.jpg,.png,.webp,image/jpeg,image/png,image/webp"
                      disabled={!isEditing}
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          await handleFileForDraft(product, file);
                        }
                        e.target.value = "";
                      }}
                    />
                    <span>Dosya sec</span>
                    <span className="text-[11px] font-normal uppercase tracking-wide">
                      JPEG/JPG/PNG/WebP
                    </span>
                  </label>
                  {draftImageNames[product.id] ? (
                    <p className="text-[11px] text-amber-100">
                      Secilen: {draftImageNames[product.id]}
                    </p>
                  ) : null}
                </div>
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
                  {isEditing ? "Kaydet" : "Duzenle"}
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
              <h1 className="text-3xl font-semibold sm:text-4xl">Urun yonetimi</h1>
            </div>
          </div>

          {!isAuthenticated ? (
            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-4 rounded-2xl border border-[#6b3f1f]/30 bg-white/50 p-5 shadow-inner sm:flex-row sm:items-end sm:gap-6"
            >
              <label className="flex flex-1 flex-col gap-2 text-sm font-medium text-[#2c1a0c]">
                Isim
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
                Sifre
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
                Giris Yap
              </button>
              {loginError && (
                <p className="text-sm font-medium text-red-200">{loginError}</p>
              )}
            </form>
          ) : (
            <>
              <div className="rounded-2xl border border-[#6b3f1f]/40 bg-[#f1d48d] p-5 shadow-inner">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
                  <label className="flex flex-1 flex-col gap-2 text-sm font-medium text-[#2c1a0c]">
                    Baslik
                    <input
                      type="text"
                      value={formValues.title}
                      onChange={(e) =>
                        setFormValues((prev) => ({ ...prev, title: e.target.value }))
                      }
                      className="rounded-xl border border-[#6b3f1f]/30 bg-white/70 px-4 py-3 text-[#2c1a0c] placeholder:text-[#72552e] focus:border-[#6b3f1f] focus:outline-none focus:ring-2 focus:ring-[#6b3f1f]/40"
                      placeholder="Urun adi"
                    />
                  </label>
                  <label className="flex flex-[1.4] flex-col gap-2 text-sm font-medium text-[#2c1a0c]">
                    Aciklama
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
                      placeholder="Kisa aciklama"
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
                  <div className="flex flex-[1.3] min-w-[260px] flex-col gap-2 text-sm font-medium text-[#2c1a0c]">
                    Gorsel
                    <div className="grid gap-2 sm:grid-cols-[1.05fr,0.95fr]">
                      <input
                        type="text"
                        value={formValues.image}
                        onChange={(e) => {
                          setCreateImageName("");
                          setFormValues((prev) => ({ ...prev, image: e.target.value }));
                        }}
                        className="rounded-xl border border-[#6b3f1f]/30 bg-white/70 px-4 py-3 text-[#2c1a0c] placeholder:text-[#72552e] focus:border-[#6b3f1f] focus:outline-none focus:ring-2 focus:ring-[#6b3f1f]/40"
                        placeholder="URL (jpg/png/webp) veya data"
                      />
                      <label
                        onDragOver={onDragOverNew}
                        onDrop={onDropNew}
                        onDragLeave={onDragLeaveNew}
                        className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 transition ${
                          isDraggingNew
                            ? "border-[#6b3f1f] bg-[#6b3f1f]/10"
                            : "border-dashed border-[#6b3f1f]/40 bg-white/60 hover:border-[#6b3f1f]"
                        }`}
                      >
                        <input
                          type="file"
                          accept=".jpeg,.jpg,.png,.webp,image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              await handleFileForNew(file);
                            }
                            e.target.value = "";
                          }}
                        />
                        <span className="text-sm text-[#2c1a0c] text-center leading-snug">
                          Surukle-birak veya dosya sec
                        </span>
                        <span className="text-[11px] font-semibold text-[#6b3f1f] leading-tight text-right">
                          JPEG/JPG/PNG/WebP
                        </span>
                      </label>
                    </div>
                    <p className="text-xs text-[#6b3f1f]">
                      {createImageName
                        ? `Secilen dosya: ${createImageName} (Kaydedince URL'e donusecek)`
                        : "URL girebilir veya dosya yukleyebilirsiniz."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={savingId === "new" || isFormInvalid || uploading}
                    className="mt-2 flex h-[52px] items-center justify-center rounded-xl bg-[#6b3f1f] px-4 text-2xl font-bold text-[#f8edd8] shadow-lg shadow-[#6b3f1f]/40 transition hover:-translate-y-0.5 hover:shadow-[#6b3f1f]/60 sm:mt-0 sm:px-5 disabled:opacity-60"
                    aria-label="Urun ekle"
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
                  <p>Eklenen urunler</p>
                  <span className="rounded-full bg-[#6b3f1f]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#6b3f1f]">
                    {products.length} urun
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
