# VoipVoice HR — Questionario attitudinale pre-colloquio

Web app React + Supabase pensata per deploy Netlify. Il questionario iniziale è stato importato dal file `Test_attitudinale_pre_colloquio.xlsx`: 40 domande, matrice scenari, item inversi, competenze e suggerimenti HR.

## 1. Crea il progetto Supabase

1. Crea un nuovo progetto su Supabase.
2. Apri **SQL Editor**.
3. Esegui integralmente `supabase/schema.sql`.
4. Esegui integralmente `supabase/seed.sql`.

Il seed crea la **versione 1 pubblicata** del questionario.

## 2. Crea l'utente HR

In Supabase vai in **Authentication > Users > Add user** e crea l'account HR con email e password.

Poi copia l'UUID dell'utente ed esegui:

```sql
insert into public.hr_users(id)
values ('UUID_UTENTE_AUTH');
```

Solo gli UUID presenti in `hr_users` possono accedere all'area HR.

## 3. Configura le variabili ambiente

Copia `.env.example` in `.env` per lo sviluppo locale:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_PUBLIC_SITE_URL=http://localhost:5173
```

Usa esclusivamente la **anon key** nel frontend. Non inserire mai la `service_role` key.

## 4. Avvio locale

```bash
npm install
npm run dev
```

Area HR: `http://localhost:5173/hr`

## 5. Deploy su Netlify

1. Pubblica questa cartella in un repository GitHub.
2. In Netlify scegli **Add new site > Import an existing project**.
3. Seleziona il repository.
4. Build command: `npm run build`.
5. Publish directory: `dist`.
6. Aggiungi in **Site configuration > Environment variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_PUBLIC_SITE_URL` = URL definitivo Netlify, ad esempio `https://nome-sito.netlify.app`
7. Esegui il deploy.

`netlify.toml` contiene già il redirect SPA necessario per `/hr/*` e `/q/:token`.

## Sicurezza

- Tutte le tabelle hanno Row Level Security attivo.
- Le tabelle HR sono leggibili/scrivibili solo da utenti autenticati presenti in `hr_users`.
- Il candidato non ha policy `SELECT` sulle tabelle.
- Il candidato usa esclusivamente tre RPC `SECURITY DEFINER`: caricamento questionario, avvio e invio.
- Il token invito viene memorizzato nel database solo come hash SHA-256.
- Le RPC candidato non restituiscono punteggi, item inversi, competenze o scoring.
- Dopo l'invio il token viene marcato come utilizzato e non può essere riusato.
- La scadenza viene verificata lato database, non solo nel browser.

## Versionamento

La pagina **Questionario** consente di modificare testo, ordine, alternative, punteggi, item inversi, competenze, fasce e suggerimenti HR. Il salvataggio crea una nuova versione pubblicata e archivia quella precedente.

Gli inviti restano legati alla versione assegnata al momento della loro creazione. I risultati salvano anche uno snapshot delle 40 risposte e dei punteggi calcolati, quindi lo storico non viene alterato dalle versioni successive.

## Struttura principale

- `src/` — frontend React
- `supabase/schema.sql` — schema, RLS e funzioni RPC
- `supabase/seed.sql` — versione iniziale derivata dall'Excel
- `.env.example` — variabili necessarie
- `netlify.toml` — build e redirect SPA

## Nota metodologica

> I punteggi descrivono tendenze emerse dalle risposte e servono a orientare il colloquio. Non costituiscono una valutazione psicologica o una misurazione psicometrica validata.
