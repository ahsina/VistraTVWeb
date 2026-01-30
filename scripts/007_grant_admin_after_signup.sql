-- Ce script doit être exécuté APRÈS avoir créé le compte via /admin/sign-up
UPDATE admin_profiles 
SET is_admin = true 
WHERE email = 'mr.ahsina@gmail.com';

-- Vérification
SELECT 
  u.email,
  u.email_confirmed_at,
  ap.is_admin,
  CASE 
    WHEN u.encrypted_password IS NOT NULL THEN 'Password is set'
    ELSE 'NO PASSWORD!'
  END as password_status
FROM auth.users u
LEFT JOIN admin_profiles ap ON u.id = ap.id
WHERE u.email = 'mr.ahsina@gmail.com';
