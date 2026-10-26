-- Run once with a migration owner, never from a public browser.
CREATE TABLE IF NOT EXISTS public.bc_state (id integer PRIMARY KEY CHECK(id=1), data jsonb NOT NULL);
ALTER TABLE public.bc_state ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.bc_state FROM PUBLIC, anon, authenticated;
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='bep_nuc_runtime') THEN
   CREATE ROLE bep_nuc_runtime NOLOGIN NOINHERIT;
 END IF;
END $$;
GRANT USAGE ON SCHEMA public TO bep_nuc_runtime;
GRANT SELECT, INSERT, UPDATE ON public.bc_state TO bep_nuc_runtime;
DROP POLICY IF EXISTS bep_nuc_runtime_state ON public.bc_state;
CREATE POLICY bep_nuc_runtime_state ON public.bc_state TO bep_nuc_runtime USING (true) WITH CHECK (true);
INSERT INTO public.bc_state(id,data) VALUES(1,'{"users":[],"shops":[],"listings":[],"vouchers":[],"quotes":[],"orders":[],"payments":[],"refunds":[],"settlements":[],"audit":[],"exposures":[],"research":[],"expenses":[],"requests":{}}'::jsonb) ON CONFLICT(id) DO NOTHING;
