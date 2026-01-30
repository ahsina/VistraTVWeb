DELETE FROM admin_profiles WHERE email = 'mr.ahsina@gmail.com';
DELETE FROM auth.identities WHERE provider_id = (SELECT id::text FROM auth.users WHERE email = 'mr.ahsina@gmail.com');
DELETE FROM auth.users WHERE email = 'mr.ahsina@gmail.com';

-- Vérification
SELECT 'User deleted successfully. Now go to /admin/sign-up to create a new account.' as message;
