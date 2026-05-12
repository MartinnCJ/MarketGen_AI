/**
 * BookWorkflow — multi-step wizard for creating or editing a book concept.
 *
 * Routes handled:
 *   /books/new          → create flow (step 1 fresh)
 *   /books/:id/edit     → edit flow (prefill from API)
 *
 * Steps:
 *   1. BookForm     — title, description, keywords, style, type, chapter count
 *   2. BookChapters — review/edit AI-generated structure, then trigger full generation
 *
 * Flow:
 *   Step 1 submit  → POST /books  → trigger POST /books/:id/chapters/generate (job)
 *                 → poll job → on complete, load chapters → Step 2
 *   Step 2 confirm → POST /books/:id/chapters/generate-all-content (job)
 *                 → poll job → on complete, navigate to editor /books/:id
 */
import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BookOpen, List, CheckCircle2 } from "lucide-react";

import { booksApi } from "@/api/axios";
import { useJobPolling } from "@/hooks/useJobPolling";
import { Spinner, FullPageSpinner } from "@/components/ui/Spinner";
import BookForm from "./BookForm";
import BookChapters from "./BookChapters";

// ── Step indicator ────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Concepto", icon: BookOpen },
  { id: 2, label: "Capítulos", icon: List },
  { id: 3, label: "Generando", icon: CheckCircle2 },
];

function StepBar({ current }) {
  return (
    <ol className="flex items-center gap-0 mb-8">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isActive = step.id === current;
        const isDone = step.id < current;
        return (
          <li key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center w-full">
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-colors ${
                  isActive
                    ? "border-primary-600 bg-primary-600 text-white"
                    : isDone
                    ? "border-primary-400 bg-primary-50 text-primary-500"
                    : "border-gray-200 bg-white text-gray-400"
                }`}
              >
                <Icon size={16} />
              </div>
              <span
                className={`mt-1 text-xs font-medium ${
                  isActive ? "text-primary-600" : isDone ? "text-primary-400" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 rounded ${
                  isDone ? "bg-primary-300" : "bg-gray-200"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BookWorkflow() {
  const { id: bookId } = useParams(); // undefined for /books/new
  const isEditing = Boolean(bookId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);
  const [currentBook, setCurrentBook] = useState(null); // populated after step 1
  const [chapters, setChapters] = useState([]);          // populated after chapter gen
  const [chapterJobId, setChapterJobId] = useState(null);
  const [contentJobId, setContentJobId] = useState(null);
  const [chapterProgress, setChapterProgress] = useState(0);
  const [contentProgress, setContentProgress] = useState(0);

  // ── Fetch existing book for editing ────────────────────────────────────────
  const { data: existingBook, isLoading: loadingBook } = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => booksApi.getBook(bookId),
    enabled: isEditing,
    select: (d) => d.data,
  });

  // ── Step 1: save book concept ──────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: (data) =>
      isEditing
        ? booksApi.updateBook(bookId, data)
        : booksApi.createBook(data),
    onSuccess: async (res) => {
      const book = res.data;
      setCurrentBook(book);

      // Kick off chapter outline generation
      const genRes = await booksApi.generateChapters(book.id, {
        chapter_count: book.chapterCount ?? 5,
      });
      setChapterJobId(genRes.data.job_id);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.detail ?? "Error al guardar el libro");
    },
  });

  // ── Poll chapter generation job ───────────────────────────────────────────
  useJobPolling(chapterJobId, {
    onProgress: setChapterProgress,
    onComplete: async (result) => {
      setChapterJobId(null);
      // Fetch fresh chapters from the API
      const res = await booksApi.getChapters(currentBook.id);
      const rawChapters = res.data ?? [];
      setChapters(rawChapters.sort((a, b) => a.orderIndex - b.orderIndex));
      setStep(2);
    },
    onError: (err) => {
      toast.error(`Generación de capítulos fallida: ${err}`);
      setChapterJobId(null);
    },
  });

  // ── Step 2: trigger full content generation ───────────────────────────────
  const generateContent = useCallback(async () => {
    if (!currentBook) return;
    try {
      // First save any chapter ordering changes the user made
      const ids = chapters.map((c) => c.id);
      await booksApi.reorderChapters(currentBook.id, { chapter_ids: ids });

      // Kick off content generation
      const res = await booksApi.generateAllContent(currentBook.id);
      setContentJobId(res.data.job_id);
      setStep(3);
    } catch (err) {
      toast.error(err?.response?.data?.detail ?? "Error al iniciar la generación");
    }
  }, [currentBook, chapters]);

  // ── Poll content generation job ───────────────────────────────────────────
  useJobPolling(contentJobId, {
    onProgress: setContentProgress,
    onComplete: () => {
      setContentJobId(null);
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("¡Contenido generado! Abriendo editor…");
      navigate(`/books/${currentBook.id}/editor`);
    },
    onError: (err) => {
      toast.error(`Generación de contenido fallida: ${err}`);
      setContentJobId(null);
      setStep(2);
    },
  });

  // ── Render ────────────────────────────────────────────────────────────────
  if (isEditing && loadingBook) return <FullPageSpinner />;

  const formInitialData = isEditing && existingBook
    ? {
        title: existingBook.title,
        description: existingBook.description,
        targetAudience: existingBook.targetAudience,
        keywords: existingBook.keywords ?? [],
        writingStyle: existingBook.writingStyle ?? "professional",
        contentType: existingBook.contentType ?? "ebook",
        chapterCount: existingBook.chapterCount ?? 5,
      }
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Editar libro" : "Nuevo libro"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isEditing
            ? "Modifica el concepto y regenera los capítulos si es necesario."
            : "Define el concepto y deja que la IA construya la estructura por ti."}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
        <StepBar current={step} />

        {/* Step 1: concept form */}
        {step === 1 && (
          <BookForm
            initialData={formInitialData}
            onSubmit={(data) => saveMutation.mutate(data)}
            isLoading={saveMutation.isPending || Boolean(chapterJobId)}
          />
        )}

        {/* Chapter generation in-progress indicator */}
        {step === 1 && chapterJobId && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Spinner size="sm" />
                Generando estructura de capítulos…
              </span>
              <span>{chapterProgress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                style={{ width: `${chapterProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 2: chapter list */}
        {step === 2 && (
          <BookChapters
            chapters={chapters}
            onChaptersChange={setChapters}
            onGenerate={generateContent}
            onBack={() => setStep(1)}
            isGenerating={Boolean(contentJobId)}
            progress={contentProgress}
          />
        )}

        {/* Step 3: full content generation in-progress */}
        {step === 3 && (
          <div className="flex flex-col items-center py-16 space-y-6">
            <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center">
              <Spinner size="lg" className="text-teal-500" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Generando contenido completo
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                La IA está escribiendo cada capítulo. Esto puede tardar unos minutos.
              </p>
            </div>
            <div className="w-full max-w-xs space-y-1.5">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Progreso</span>
                <span>{contentProgress}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-primary-500 rounded-full transition-all duration-700"
                  style={{ width: `${contentProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
