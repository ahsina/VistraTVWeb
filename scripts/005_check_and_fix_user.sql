DO $$
DECLARE
    user_record RECORD;
    profile_record RECORD;
    user_id_var UUID;
BEGIN
    RAISE NOTICE '===== CHECKING USER STATUS =====';
    
    -- Check if user exists in auth.users
    SELECT * INTO user_record
    FROM auth.users
    WHERE email = 'mr.ahsina@gmail.com';
    
    IF user_record.id IS NULL THEN
        RAISE NOTICE '❌ USER DOES NOT EXIST in auth.users';
        RAISE NOTICE 'You need to sign up at /admin/sign-up first!';
    ELSE
        RAISE NOTICE '✅ User exists in auth.users';
        RAISE NOTICE '   ID: %', user_record.id;
        RAISE NOTICE '   Email: %', user_record.email;
        RAISE NOTICE '   Email confirmed: %', COALESCE(user_record.email_confirmed_at::text, 'NOT CONFIRMED');
        RAISE NOTICE '   Created at: %', user_record.created_at;
        RAISE NOTICE '   Last sign in: %', COALESCE(user_record.last_sign_in_at::text, 'NEVER');
        RAISE NOTICE '   Encrypted password exists: %', (user_record.encrypted_password IS NOT NULL AND user_record.encrypted_password != '');
        
        user_id_var := user_record.id;
        
        -- Check email confirmation
        IF user_record.email_confirmed_at IS NULL THEN
            RAISE NOTICE '⚠️  EMAIL NOT CONFIRMED - Confirming now...';
            UPDATE auth.users
            SET 
                email_confirmed_at = NOW(),
                confirmation_token = NULL,
                confirmation_sent_at = NULL
            WHERE id = user_id_var;
            RAISE NOTICE '✅ Email confirmed!';
        END IF;
        
        -- Check if password hash exists
        IF user_record.encrypted_password IS NULL OR user_record.encrypted_password = '' THEN
            RAISE NOTICE '❌ PASSWORD HASH IS MISSING OR EMPTY';
            RAISE NOTICE 'This means the user was not created properly through Supabase signup.';
            RAISE NOTICE 'You MUST sign up again at /admin/sign-up to set the password correctly.';
        ELSE
            RAISE NOTICE '✅ Password hash exists (length: %)', length(user_record.encrypted_password);
        END IF;
        
        -- Check admin profile
        SELECT * INTO profile_record
        FROM admin_profiles
        WHERE email = 'mr.ahsina@gmail.com';
        
        IF profile_record.id IS NULL THEN
            RAISE NOTICE '⚠️  Admin profile missing - Creating now...';
            INSERT INTO admin_profiles (id, email, full_name, is_admin)
            VALUES (user_id_var, 'mr.ahsina@gmail.com', 'Admin', true)
            ON CONFLICT (id) DO UPDATE
            SET is_admin = true, full_name = 'Admin';
            RAISE NOTICE '✅ Admin profile created!';
        ELSE
            RAISE NOTICE '✅ Admin profile exists';
            RAISE NOTICE '   Is admin: %', profile_record.is_admin;
            RAISE NOTICE '   Full name: %', profile_record.full_name;
            
            IF NOT profile_record.is_admin THEN
                RAISE NOTICE '⚠️  User is not admin - Granting admin privileges...';
                UPDATE admin_profiles
                SET is_admin = true
                WHERE id = user_id_var;
                RAISE NOTICE '✅ Admin privileges granted!';
            END IF;
        END IF;
    END IF;
    
    RAISE NOTICE '===== DIAGNOSIS COMPLETE =====';
    
END $$;
