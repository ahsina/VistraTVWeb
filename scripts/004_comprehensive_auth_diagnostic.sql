-- ============================================
-- DIAGNOSTIC COMPLET DE L'AUTHENTIFICATION SUPABASE
-- ============================================
-- Ce script identifie tous les problèmes potentiels qui causent "Database error querying schema"

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'DIAGNOSTIC AUTH SUPABASE';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
END $$;

-- 1. Vérifier les permissions sur auth.users
DO $$
DECLARE
  table_owner TEXT;
BEGIN
  RAISE NOTICE '1. VÉRIFICATION DES PERMISSIONS SUR auth.users';
  RAISE NOTICE '-----------------------------------------------';
  
  SELECT tableowner INTO table_owner
  FROM pg_tables
  WHERE schemaname = 'auth' AND tablename = 'users';
  
  RAISE NOTICE 'Propriétaire de auth.users: %', table_owner;
  
  IF table_owner != 'supabase_auth_admin' THEN
    RAISE NOTICE '⚠️  PROBLÈME: auth.users devrait appartenir à supabase_auth_admin';
    RAISE NOTICE '   Correction automatique en cours...';
    EXECUTE 'ALTER TABLE auth.users OWNER TO supabase_auth_admin';
    RAISE NOTICE '✓ Propriétaire corrigé';
  ELSE
    RAISE NOTICE '✓ Propriétaire correct';
  END IF;
  
  RAISE NOTICE '';
END $$;

-- 2. Vérifier les triggers sur auth.users
DO $$
DECLARE
  trigger_rec RECORD;
  trigger_count INT := 0;
BEGIN
  RAISE NOTICE '2. TRIGGERS SUR auth.users';
  RAISE NOTICE '-----------------------------------------------';
  
  FOR trigger_rec IN
    SELECT tgname, pg_get_triggerdef(oid) as definition
    FROM pg_trigger
    WHERE tgrelid = 'auth.users'::regclass
    AND tgname NOT LIKE 'pg_%'
  LOOP
    trigger_count := trigger_count + 1;
    RAISE NOTICE 'Trigger trouvé: %', trigger_rec.tgname;
    RAISE NOTICE 'Définition: %', trigger_rec.definition;
    
    -- Supprimer les triggers personnalisés qui peuvent causer des problèmes
    IF trigger_rec.tgname LIKE '%admin_profile%' OR 
       trigger_rec.tgname LIKE '%create_profile%' OR
       trigger_rec.tgname NOT LIKE 'on_%' THEN
      RAISE NOTICE '⚠️  Suppression du trigger personnalisé: %', trigger_rec.tgname;
      EXECUTE format('DROP TRIGGER IF EXISTS %I ON auth.users', trigger_rec.tgname);
      RAISE NOTICE '✓ Trigger supprimé';
    END IF;
  END LOOP;
  
  IF trigger_count = 0 THEN
    RAISE NOTICE '✓ Aucun trigger personnalisé trouvé';
  END IF;
  
  RAISE NOTICE '';
END $$;

-- 3. Vérifier les contraintes de clés étrangères vers auth.users
DO $$
DECLARE
  fk_rec RECORD;
  fk_count INT := 0;
BEGIN
  RAISE NOTICE '3. CONTRAINTES DE CLÉS ÉTRANGÈRES VERS auth.users';
  RAISE NOTICE '-----------------------------------------------';
  
  FOR fk_rec IN
    SELECT
      tc.table_schema,
      tc.table_name,
      tc.constraint_name,
      kcu.column_name,
      rc.delete_rule,
      rc.update_rule
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.referential_constraints AS rc
      ON tc.constraint_name = rc.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON rc.unique_constraint_name = ccu.constraint_name
    WHERE ccu.table_schema = 'auth'
      AND ccu.table_name = 'users'
      AND tc.constraint_type = 'FOREIGN KEY'
  LOOP
    fk_count := fk_count + 1;
    RAISE NOTICE 'FK trouvée: %.% (%) -> auth.users', 
      fk_rec.table_schema, fk_rec.table_name, fk_rec.column_name;
    RAISE NOTICE '  DELETE: %, UPDATE: %', fk_rec.delete_rule, fk_rec.update_rule;
    
    -- Vérifier si la règle DELETE est problématique
    IF fk_rec.delete_rule NOT IN ('SET NULL', 'CASCADE', 'SET DEFAULT') THEN
      RAISE NOTICE '  ⚠️  PROBLÈME: DELETE RULE devrait être SET NULL, CASCADE, ou SET DEFAULT';
    ELSE
      RAISE NOTICE '  ✓ DELETE RULE correct';
    END IF;
  END LOOP;
  
  IF fk_count = 0 THEN
    RAISE NOTICE '✓ Aucune contrainte de clé étrangère vers auth.users';
  END IF;
  
  RAISE NOTICE '';
END $$;

-- 4. Vérifier si l'utilisateur existe
DO $$
DECLARE
  user_exists BOOLEAN;
  user_confirmed BOOLEAN;
  user_id UUID;
BEGIN
  RAISE NOTICE '4. VÉRIFICATION DE L''UTILISATEUR mr.ahsina@gmail.com';
  RAISE NOTICE '-----------------------------------------------';
  
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'mr.ahsina@gmail.com') INTO user_exists;
  
  IF user_exists THEN
    SELECT id, confirmed_at IS NOT NULL INTO user_id, user_confirmed
    FROM auth.users
    WHERE email = 'mr.ahsina@gmail.com';
    
    RAISE NOTICE '✓ Utilisateur trouvé';
    RAISE NOTICE '  ID: %', user_id;
    RAISE NOTICE '  Email confirmé: %', user_confirmed;
    
    IF NOT user_confirmed THEN
      RAISE NOTICE '  ⚠️  Email non confirmé - confirmation automatique...';
      UPDATE auth.users
      SET confirmed_at = NOW(),
          email_confirmed_at = NOW()
      WHERE email = 'mr.ahsina@gmail.com';
      RAISE NOTICE '  ✓ Email confirmé automatiquement';
    END IF;
  ELSE
    RAISE NOTICE '⚠️  Utilisateur NON TROUVÉ dans auth.users';
    RAISE NOTICE '   L''utilisateur doit être créé via /admin/sign-up';
  END IF;
  
  RAISE NOTICE '';
END $$;

-- 5. Vérifier le profil admin
DO $$
DECLARE
  profile_exists BOOLEAN;
  is_admin_value BOOLEAN;
BEGIN
  RAISE NOTICE '5. VÉRIFICATION DU PROFIL ADMIN';
  RAISE NOTICE '-----------------------------------------------';
  
  SELECT EXISTS(
    SELECT 1 FROM admin_profiles WHERE email = 'mr.ahsina@gmail.com'
  ) INTO profile_exists;
  
  IF profile_exists THEN
    SELECT is_admin INTO is_admin_value
    FROM admin_profiles
    WHERE email = 'mr.ahsina@gmail.com';
    
    RAISE NOTICE '✓ Profil admin trouvé';
    RAISE NOTICE '  is_admin: %', is_admin_value;
    
    IF NOT is_admin_value THEN
      RAISE NOTICE '  ⚠️  Utilisateur pas admin - mise à jour...';
      UPDATE admin_profiles
      SET is_admin = true
      WHERE email = 'mr.ahsina@gmail.com';
      RAISE NOTICE '  ✓ Privilèges admin accordés';
    END IF;
  ELSE
    RAISE NOTICE '⚠️  Profil admin NON TROUVÉ';
    RAISE NOTICE '   Création du profil...';
    
    INSERT INTO admin_profiles (id, email, full_name, is_admin)
    SELECT id, email, 'Admin', true
    FROM auth.users
    WHERE email = 'mr.ahsina@gmail.com'
    ON CONFLICT (id) DO UPDATE
    SET is_admin = true;
    
    RAISE NOTICE '✓ Profil admin créé';
  END IF;
  
  RAISE NOTICE '';
END $$;

-- 6. Vérifier les policies RLS sur admin_profiles
DO $$
DECLARE
  policy_rec RECORD;
  policy_count INT := 0;
BEGIN
  RAISE NOTICE '6. POLICIES RLS SUR admin_profiles';
  RAISE NOTICE '-----------------------------------------------';
  
  FOR policy_rec IN
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'admin_profiles'
  LOOP
    policy_count := policy_count + 1;
    RAISE NOTICE 'Policy: %', policy_rec.policyname;
    RAISE NOTICE '  Commande: %, Roles: %', policy_rec.cmd, policy_rec.roles;
  END LOOP;
  
  IF policy_count = 0 THEN
    RAISE NOTICE '⚠️  Aucune policy trouvée sur admin_profiles';
  ELSE
    RAISE NOTICE '✓ % policies trouvées', policy_count;
  END IF;
  
  RAISE NOTICE '';
END $$;

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'FIN DU DIAGNOSTIC';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Si des problèmes persistent, vérifiez les logs Supabase dans le dashboard:';
  RAISE NOTICE 'Dashboard > Logs > Auth Logs';
END $$;
