-- 0008_book_wizard.sql
-- Book wizard fields + poem writing theme

-- Book: type preset, layout template, image mode
ALTER TABLE poem_books ADD COLUMN IF NOT EXISTS book_type text;
ALTER TABLE poem_books ADD COLUMN IF NOT EXISTS layout_template text NOT NULL DEFAULT 'basic_collection';
ALTER TABLE poem_books ADD COLUMN IF NOT EXISTS image_mode text NOT NULL DEFAULT 'none';

-- Poem: writing theme
ALTER TABLE poems ADD COLUMN IF NOT EXISTS theme text NOT NULL DEFAULT 'paper';
