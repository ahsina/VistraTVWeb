-- Confirmer l'email de l'utilisateur admin
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  -- Using DEFAULT for confirmed_at as it can only be updated to DEFAULT
  confirmed_at = DEFAULT,
  -- S'assurer que l'email est aussi marqué comme vérifié
  raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"email_verified": true}'::jsonb,
  -- Mettre à jour le timestamp
  updated_at = NOW()
WHERE email = 'mr.ahsina@gmail.com';

-- Vérifier le résultat
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✓ Email confirmé'
    ELSE '✗ Email NON confirmé'
  END as status
FROM auth.users
WHERE email = 'mr.ahsina@gmail.com';
