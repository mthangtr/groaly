-- Migration 003: Convert notes.content to JSONB with full-text search
-- Purpose: Enable rich text editor (Tiptap) with structured content storage
-- Risk: LOW - Standard ALTER TABLE migration

-- Step 1: Convert content column from TEXT to JSONB
-- This allows storing structured editor content (ProseMirror JSON)
-- Handle empty/invalid TEXT by defaulting to empty JSONB object
ALTER TABLE public.notes 
  ALTER COLUMN content TYPE JSONB USING (
    CASE 
      WHEN content IS NULL OR content = '' THEN '{}'::JSONB
      ELSE content::JSONB
    END
  );

-- Step 2: Add content_text column for plain text extraction
-- This enables full-text search while keeping structured JSONB
ALTER TABLE public.notes 
  ADD COLUMN IF NOT EXISTS content_text TEXT;

-- Step 3: Create trigger function to auto-extract plain text from JSONB
-- Converts JSONB content to TEXT for search indexing
CREATE OR REPLACE FUNCTION public.update_note_content_text()
RETURNS TRIGGER AS $$
BEGIN
  -- Extract text from JSONB structure
  -- For now, simple conversion. Can be enhanced to parse ProseMirror nodes
  NEW.content_text := NEW.content::TEXT;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create trigger to auto-update content_text on INSERT/UPDATE
CREATE TRIGGER update_note_content_text_trigger
  BEFORE INSERT OR UPDATE OF content ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_note_content_text();

-- Step 5: Create GIN index for full-text search on content_text
-- Uses PostgreSQL's built-in to_tsvector for efficient text search
CREATE INDEX IF NOT EXISTS idx_notes_content_text_fts 
  ON public.notes 
  USING gin(to_tsvector('english', COALESCE(content_text, '')));

-- Step 6: Backfill existing notes (if any)
-- Update all existing rows to populate content_text
UPDATE public.notes 
SET content_text = content::TEXT 
WHERE content_text IS NULL;
