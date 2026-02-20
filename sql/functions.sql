-- =============================================
-- Run this in Supabase SQL Editor
-- Adds the increment_views RPC function
-- Called when a user views a PDF
-- =============================================

create or replace function increment_views(uid uuid)
returns void as $$
  update profiles
  set pdfs_viewed = pdfs_viewed + 1
  where id = uid;
$$ language sql security definer;


-- =============================================
-- Also run this — lets the homepage read
-- university type from the pdfs join query
-- =============================================

create or replace function increment_download(pid uuid)
returns void as $$
  update pdfs
  set download_count = download_count + 1
  where id = pid;
$$ language sql security definer;
