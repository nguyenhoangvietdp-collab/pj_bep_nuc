-- Public product photos only. Uploads go through the authenticated server;
-- no INSERT/UPDATE/DELETE policy is granted to browser roles.
INSERT INTO storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
VALUES ('bep-nuc-lots','bep-nuc-lots',true,2097152,ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET public=true,file_size_limit=2097152,allowed_mime_types=EXCLUDED.allowed_mime_types;
