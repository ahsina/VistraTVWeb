-- ============================================
-- SCRIPT DE DIAGNOSTIC ET RÉPARATION AUTH
-- ============================================
-- Ce script diagnostique et répare les problèmes d'authentification Supabase

-- 1. DIAGNOSTIC: Liste tous les triggers sur auth.users
DO $$
BEGIN
  RAISE NOTICE '========== TRIGGERS SUR auth.users ==========';
END $$;

SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users';

-- 2. SUPPRESSION: Supprimer tous les triggers personnalisés sur auth.users
DO $$
DECLARE
  trigger_record RECORD;
BEGIN
  RAISE NOTICE '========== SUPPRESSION DES TRIGGERS ==========';
  
  FOR trigger_record IN 
    SELECT trigger_name
    FROM information_schema.triggers
    WHERE event_object_schema = 'auth' 
      AND event_object_table = 'users'
      AND trigger_name LIKE '%admin%' -- Supprimer uniquement nos triggers personnalisés
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON auth.users', trigger_record.trigger_name);
    RAISE NOTICE 'Trigger supprimé: %', trigger_record.trigger_name;
  END LOOP;
END $$;

-- 3. DIAGNOSTIC: Vérifier les contraintes de clés étrangères vers auth.users
DO $$
BEGIN
  RAISE NOTICE '========== CONTRAINTES VERS auth.users ==========';
END $$;

SELECT
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  confrelid::regclass AS foreign_table,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE confrelid = 'auth.users'::regclass
  AND contype = 'f';

-- 4. SUPPRESSION: Supprimer les contraintes problématiques si nécessaire
-- (Décommentez si vous avez des contraintes vers auth.users)
-- ALTER TABLE admin_profiles DROP CONSTRAINT IF EXISTS admin_profiles_id_fkey;

-- 5. DIAGNOSTIC: Vérifier les permissions sur auth.users
DO $$
BEGIN
  RAISE NOTICE '========== PERMISSIONS SUR auth.users ==========';
END $$;

SELECT 
  grantee, 
  privilege_type
FROM information_schema.role_table_grants 
WHERE table_schema = 'auth' 
  AND table_name = 'users'
  AND grantee = 'supabase_auth_admin';

-- 6. RÉPARATION: Restaurer les permissions si nécessaires
GRANT ALL ON auth.users TO supabase_auth_admin;
GRANT ALL ON auth.identities TO supabase_auth_admin;

-- 7. VÉRIFICATION: L'utilisateur existe-t-il ?
DO $$
DECLARE
  user_count INTEGER;
BEGIN
  RAISE NOTICE '========== VÉRIFICATION UTILISATEUR ==========';
  
  SELECT COUNT(*) INTO user_count
  FROM auth.users
  WHERE email = 'mr.ahsina@gmail.com';
  
  IF user_count > 0 THEN
    RAISE NOTICE 'Utilisateur trouvé: mr.ahsina@gmail.com';
    RAISE NOTICE 'Email confirmé: %', (SELECT email_confirmed_at IS NOT NULL FROM auth.users WHERE email = 'mr.ahsina@gmail.com');
  ELSE
    RAISE NOTICE 'ATTENTION: Utilisateur NON TROUVÉ dans auth.users!';
    RAISE NOTICE 'Vous devez créer le compte via l''interface sign-up.';
  END IF;
END $$;

-- 8. VÉRIFICATION: Le profil admin existe-t-il ?
DO $$
DECLARE
  profile_count INTEGER;
  admin_status BOOLEAN;
BEGIN
  RAISE NOTICE '========== VÉRIFICATION PROFIL ADMIN ==========';
  
  SELECT COUNT(*) INTO profile_count
  FROM admin_profiles
  WHERE email = 'mr.ahsina@gmail.com';
  
  IF profile_count > 0 THEN
    SELECT is_admin INTO admin_status
    FROM admin_profiles
    WHERE email = 'mr.ahsina@gmail.com';
    
    RAISE NOTICE 'Profil admin trouvé';
    RAISE NOTICE 'Status admin: %', admin_status;
  ELSE
    RAISE NOTICE 'ATTENTION: Profil admin NON TROUVÉ!';
  END IF;
END $$;

-- 9. RÉSUMÉ FINAL
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'DIAGNOSTIC TERMINÉ';
  RAISE NOTICE 'Vérifiez les résultats ci-dessus';
  RAISE NOTICE '========================================';
END $$;
