-- 0009_book_redesign.sql
-- Simple cover system (background color + optional sample image) + text settings

ALTER TABLE poem_books ADD COLUMN IF NOT EXISTS cover_background_color text NOT NULL DEFAULT '#F6F1E7';
ALTER TABLE poem_books ADD COLUMN IF NOT EXISTS cover_image_url text;
ALTER TABLE poem_books ADD COLUMN IF NOT EXISTS cover_image_category text;
ALTER TABLE poem_books ADD COLUMN IF NOT EXISTS cover_image_position text NOT NULL DEFAULT 'none';
ALTER TABLE poem_books ADD COLUMN IF NOT EXISTS text_settings jsonb NOT NULL DEFAULT '{}'::jsonb;
