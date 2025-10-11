-- To check if user is an admin 
CREATE OR REPLACE FUNCTION get_current_user_is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  is_admin_val boolean;
BEGIN
  SELECT is_admin INTO is_admin_val FROM public.users WHERE id = auth.uid();
  RETURN COALESCE(is_admin_val, FALSE);
END;
$$;

-- To automatically insert user data into the table on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, phone_number, is_internal)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'phone_number',
    (NEW.email LIKE '%@cb.students.amrita.edu')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_profile();

-- To expose country & committee data publicly
CREATE OR REPLACE FUNCTION get_public_country_matrix()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
    RETURN (
        SELECT
            json_agg(
                json_build_object(
                    'committee_id', s.committee_id,
                    'committee_name', s.committee_name,
                    'countries', s.countries
                ) ORDER BY s.committee_name
            )
        FROM (
            SELECT
                cd.committee_id,
                cd.committee_name,
                json_agg(
                    json_build_object(
                        'country_id', cd.country_id,
                        'country_name', cd.country_name,
                        'is_allocated', cd.is_allocated
                    ) ORDER BY cd.country_name
                ) AS countries
            FROM
                (
                    SELECT
                        com.id AS committee_id,
                        com.name AS committee_name,
                        cy.id AS country_id,
                        cy.name AS country_name,
                        EXISTS (
                            SELECT 1
                            FROM allocations a
                            WHERE a.country_id = cy.id AND a.committee_id = com.id
                        ) AS is_allocated
                    FROM
                        committees com
                    JOIN
                        countries cy ON com.id = cy.committee_id
                ) cd
            GROUP BY
                cd.committee_id, cd.committee_name
        ) s
    );
END;
$$;

GRANT EXECUTE ON FUNCTION get_public_country_matrix() TO anon;
GRANT EXECUTE ON FUNCTION get_public_country_matrix() TO authenticated;

-- To sync the state of double_del in allocations
CREATE OR REPLACE FUNCTION sync_allocation_delegation_flag()
RETURNS TRIGGER AS $$
BEGIN
  SELECT is_double_delegation INTO NEW.is_double_delegation
  FROM committees WHERE id = NEW.committee_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_allocation_delegation_flag
BEFORE INSERT ON allocations
FOR EACH ROW EXECUTE FUNCTION sync_allocation_delegation_flag();

-- To enforce max 2 delegates in double del committees
CREATE OR REPLACE FUNCTION check_double_delegation_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_double_delegation = TRUE THEN
    IF (
      SELECT COUNT(*) FROM allocations
      WHERE committee_id = NEW.committee_id AND country_id = NEW.country_id
    ) >= 2 THEN
      RAISE EXCEPTION 'Only 2 delegates allowed per allocation in double del committees';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_double_delegation_limit
BEFORE INSERT ON allocations
FOR EACH ROW EXECUTE FUNCTION check_double_delegation_limit();
