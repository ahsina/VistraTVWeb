-- Créer le profil admin pour l'utilisateur mr.ahsina@gmail.com
-- User ID: 7ee90796-cd88-4101-bcf5-68c285c73690

DO $$
DECLARE
    v_user_id UUID := '7ee90796-cd88-4101-bcf5-68c285c73690';
    v_email TEXT := 'mr.ahsina@gmail.com';
    v_full_name TEXT := 'Admin';
BEGIN
    -- Vérifier si le profil existe déjà
    IF EXISTS (SELECT 1 FROM admin_profiles WHERE id = v_user_id) THEN
        -- Mise à jour du profil existant
        UPDATE admin_profiles 
        SET 
            is_admin = true,
            email = v_email,
            full_name = v_full_name,
            updated_at = NOW()
        WHERE id = v_user_id;
        
        RAISE NOTICE 'Admin profile updated for user: %', v_email;
    ELSE
        -- Insertion d'un nouveau profil
        INSERT INTO admin_profiles (id, email, full_name, is_admin, created_at, updated_at)
        VALUES (v_user_id, v_email, v_full_name, true, NOW(), NOW());
        
        RAISE NOTICE 'Admin profile created for user: %', v_email;
    END IF;
    
    -- Vérification finale
    IF EXISTS (SELECT 1 FROM admin_profiles WHERE id = v_user_id AND is_admin = true) THEN
        RAISE NOTICE 'SUCCESS: Admin profile verified for user % with ID %', v_email, v_user_id;
    ELSE
        RAISE EXCEPTION 'FAILED: Admin profile was not created properly';
    END IF;
END $$;

-- Afficher le profil créé
SELECT 
    id,
    email,
    full_name,
    is_admin,
    created_at,
    updated_at
FROM admin_profiles
WHERE id = '7ee90796-cd88-4101-bcf5-68c285c73690';
