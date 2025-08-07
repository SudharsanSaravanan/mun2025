-- Users RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view their own user record"
ON users FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY "Authenticated users can insert their own user record"
ON users FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all user records"
ON users FOR SELECT TO authenticated
USING (get_current_user_is_admin());

-- Committees RLS Policies
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users can view committees"
ON committees FOR SELECT TO public
USING (true);

-- Countries RLS Policies
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users can view countries"
ON countries FOR SELECT TO public
USING (true);

-- User Preferences RLS Policies
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage their own user preferences"
ON user_preferences FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all user preferences"
ON user_preferences FOR SELECT TO authenticated
USING (get_current_user_is_admin());

-- Delegate Country Preferences RLS Policies
ALTER TABLE delegate_country_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage their own Delegate Country preferences"
ON delegate_country_preferences FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all Delegate Country preferences"
ON delegate_country_preferences FOR SELECT TO authenticated
USING (get_current_user_is_admin());

-- Internal Registrations RLS Policies
ALTER TABLE internal_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage their own internal registration"
ON internal_registrations FOR ALL TO authenticated
USING (user_id = auth.uid() AND (SELECT u.is_internal FROM users u WHERE u.id = auth.uid()) = TRUE)
WITH CHECK (user_id = auth.uid() AND (SELECT u.is_internal FROM users u WHERE u.id = auth.uid()) = TRUE);

CREATE POLICY "Admins can view all internal registrations"
ON internal_registrations FOR SELECT TO authenticated
USING (get_current_user_is_admin());

-- External Registrations RLS Policies
ALTER TABLE external_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage their own external registration"
ON external_registrations FOR ALL TO authenticated
USING (user_id = auth.uid() AND (SELECT u.is_internal FROM users u WHERE u.id = auth.uid()) = FALSE)
WITH CHECK (user_id = auth.uid() AND (SELECT u.is_internal FROM users u WHERE u.id = auth.uid()) = FALSE);

CREATE POLICY "Admins can view all external registrations"
ON external_registrations FOR SELECT TO authenticated
USING (get_current_user_is_admin());

-- Allocations RLS Policies
ALTER TABLE allocations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage allocations"
ON allocations FOR ALL TO authenticated
USING (get_current_user_is_admin())
WITH CHECK (get_current_user_is_admin());

CREATE POLICY "Authenticated users can view their own allocation"
ON allocations FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Storage objects RLS Policies
CREATE POLICY "Authenticated users can manage to their own files to registration-files"
ON storage.objects FOR ALL TO authenticated
USING (
    bucket_id = 'registration-files' AND
    split_part(name, '/', 1) = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'registration-files' AND
    split_part(name, '/', 1) = auth.uid()::text
);

CREATE POLICY "Admins can select any file from registration-files"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'registration-files' AND
    public.get_current_user_is_admin()
);

CREATE POLICY "Any user can select files from background-guides"
ON storage.objects
FOR SELECT
USING (bucket_id = 'background-guides');

CREATE POLICY "Only users with service_role can upload to background-guides"
ON storage.objects
FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'background-guides');
