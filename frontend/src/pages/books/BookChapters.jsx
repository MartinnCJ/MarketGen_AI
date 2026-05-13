/**
 * BookChapters — Step 2 of the book creation wizard.
 * Shows AI-generated chapter list with drag-and-drop reordering,
 * inline editing of title/description, add/delete, and a "Generate content" CTA.
 *
 * Props:
 *   chapters        — array of { id, title, description, orderIndex }
 *   onChaptersChange(chapters) — called on every mutation
 *   onGenerate()    — called when user confirms and wants AI to write content
 *   onBack()        — go back to Step 1
 *   isGenerating    — show loading state on the Generate button
 *   progress        — 0-100 job progress
 */
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Pencil,
  Trash2,
  Plus,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  Wand2,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import Button from "@/components/ui/Button";

// ── Sortable chapter row ──────────────────────────────────────────────────────
function ChapterRow({ chapter, index, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm group"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="mt-0.5 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing focus:outline-none"
        aria-label="Drag to reorder"
      >
        <GripVertical size={20} />
      </button>

      {/* Order number */}
      <span className="flex-shrink-0 mt-0.5 w-7 h-7 flex items-center justify-center rounded-full bg-primary-50 text-primary-600 text-xs font-bold">
        {index + 1}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{chapter.title}</p>
        {chapter.description && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{chapter.description}</p>
        )}
      </div>

      {/* Actions (visible on hover) */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(chapter)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          aria-label="Edit chapter"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => onDelete(chapter.id)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          aria-label="Delete chapter"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

// ── Inline edit modal ─────────────────────────────────────────────────────────
function EditChapterModal({ chapter, onSave, onClose }) {
  const [title, setTitle] = useState(chapter?.title ?? "");
  const [description, setDescription] = useState(chapter?.description ?? "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h3 className="text-base font-semibold text-gray-900">Editar capítulo</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
          <input
            autoFocus
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción breve</label>
          <textarea
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="secondary" size="sm" onClick={onClose}>Cancelar</Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => title.trim() && onSave({ ...chapter, title: title.trim(), description })}
          >
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BookChapters({
  chapters,
  onChaptersChange,
  onGenerate,
  onBack,
  isGenerating = false,
  progress = 0,
}) {
  const [editingChapter, setEditingChapter] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ── DnD handlers ─────────────────────────────────────────────────────────
  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = chapters.findIndex((c) => c.id === active.id);
    const newIndex = chapters.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(chapters, oldIndex, newIndex).map((c, i) => ({
      ...c,
      orderIndex: i,
    }));
    onChaptersChange(reordered);
  };

  // ── CRUD ─────────────────────────────────────────────────────────────────
  const addChapter = () => {
    const newChapter = {
      id: uuidv4(),
      title: `Capítulo ${chapters.length + 1}`,
      description: "",
      orderIndex: chapters.length,
    };
    onChaptersChange([...chapters, newChapter]);
    setEditingChapter(newChapter);
  };

  const deleteChapter = (id) => {
    const updated = chapters
      .filter((c) => c.id !== id)
      .map((c, i) => ({ ...c, orderIndex: i }));
    onChaptersChange(updated);
  };

  const saveChapter = (updated) => {
    onChaptersChange(chapters.map((c) => (c.id === updated.id ? updated : c)));
    setEditingChapter(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Estructura de capítulos
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Arrastra para reordenar · Haz clic en <Pencil size={11} className="inline" /> para editar
          </p>
        </div>
        <button
          onClick={addChapter}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-primary-300 text-primary-600 text-sm font-medium hover:bg-primary-50 transition-colors"
        >
          <Plus size={15} />
          Añadir capítulo
        </button>
      </div>

      {/* Chapter list */}
      {chapters.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
          <CheckCircle2 size={36} className="mb-2 opacity-40" />
          <p className="text-sm">Sin capítulos. Añade uno o vuelve al paso anterior.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={chapters.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {chapters.map((chapter, index) => (
                <ChapterRow
                  key={chapter.id}
                  chapter={chapter}
                  index={index}
                  onEdit={setEditingChapter}
                  onDelete={deleteChapter}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Progress bar (visible while generating) */}
      {isGenerating && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Loader2 size={12} className="animate-spin" />
              Generando contenido con IA…
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <Button
          variant="ghost"
          size="md"
          onClick={onBack}
          icon={<ChevronLeft size={16} />}
          disabled={isGenerating}
        >
          Volver
        </Button>
        <Button
          variant="teal"
          size="lg"
          onClick={onGenerate}
          isLoading={isGenerating}
          disabled={chapters.length === 0 || isGenerating}
          icon={<Wand2 size={18} />}
        >
          {isGenerating ? "Generando…" : "Confirmar y generar contenido"}
        </Button>
      </div>

      {/* Edit modal */}
      {editingChapter && (
        <EditChapterModal
          chapter={editingChapter}
          onSave={saveChapter}
          onClose={() => setEditingChapter(null)}
        />
      )}
    </div>
  );
}
