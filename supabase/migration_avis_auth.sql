-- À exécuter dans le SQL editor de Supabase avant de tester le nouveau système d'avis.

alter table avis add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table avis add column if not exists email text;
alter table avis add column if not exists token text;
alter table avis add column if not exists email_verifie boolean not null default false;

create index if not exists avis_token_idx on avis (token);
create index if not exists avis_user_id_idx on avis (user_id);

-- L'insert anonyme existant reste valable (les invités utilisent la clé anon).
-- Les invités sont créés avec email_verifie = false ; le lien envoyé par Resend
-- passe ce champ à true via l'API /api/valider-avis (qui utilise la clé service_role
-- et n'est donc pas concernée par RLS).
