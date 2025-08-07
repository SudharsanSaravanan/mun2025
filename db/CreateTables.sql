CREATE TYPE user_role_type AS ENUM ('delegate', 'IP');
CREATE TYPE ip_role_type AS ENUM ('reporter', 'photojournalist');
CREATE TYPE delegation_option_type AS ENUM ('individual', 'group');

CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    is_internal BOOLEAN NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE committees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    is_double_delegation BOOLEAN NOT NULL DEFAULT FALSE,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    committee_id UUID REFERENCES committees(id) ON DELETE CASCADE,
    UNIQUE (name, committee_id)
);

CREATE TABLE user_preferences (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  preference_order SMALLINT NOT NULL CHECK (preference_order BETWEEN 1 AND 3),
  role user_role_type NOT NULL,
  ip_subrole ip_role_type,
  co_delegate_name TEXT,
  co_delegate_email TEXT,
  PRIMARY KEY (user_id, preference_order),
  CONSTRAINT check_ip_preference_logic CHECK (
    (role = 'IP' AND ip_subrole IS NOT NULL)
    OR
    (role = 'delegate' AND ip_subrole IS NULL)
  ),
);

CREATE TABLE delegate_country_preferences (
  user_id UUID NOT NULL,
  preference_order SMALLINT NOT NULL,
  country_order SMALLINT NOT NULL CHECK (country_order BETWEEN 1 AND 3),
  country_id UUID NOT NULL REFERENCES countries(id),
  PRIMARY KEY (user_id, preference_order, country_order),
  FOREIGN KEY (user_id, preference_order)
      REFERENCES user_preferences(user_id, preference_order)
      ON DELETE CASCADE
);

CREATE TABLE ip_committee_preferences (
  user_id UUID NOT NULL,
  preference_order SMALLINT NOT NULL CHECK (preference_order BETWEEN 1 AND 3),
  committee_order SMALLINT NOT NULL CHECK (committee_order BETWEEN 1 AND 3),
  committee_id UUID NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, preference_order, committee_order),
  FOREIGN KEY (user_id, preference_order)
    REFERENCES user_preferences(user_id, preference_order)
    ON DELETE CASCADE
);


CREATE TABLE internal_registrations (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    roll_number TEXT NOT NULL,
    college_id_photo_url TEXT NOT NULL,
    delegate_experience_doc_url TEXT NOT NULL,
    payment_id TEXT NOT NULL,
    payment_proof_url TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    bank_branch TEXT NOT NULL,
    payment_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE external_registrations (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    residential_address TEXT NOT NULL,
    residential_pincode TEXT NOT NULL,
    university_name TEXT NOT NULL,
    university_address TEXT NOT NULL,
    university_pincode TEXT NOT NULL,
    id_proof_url TEXT NOT NULL,
    accomodation_required BOOLEAN NOT NULL,
    delegation_type delegation_option_type NOT NULL,
    delegation_name TEXT,
    is_head_of_delegation BOOLEAN,
    delegation_sheet_url TEXT,
    delegate_experience_doc_url TEXT NOT NULL,
    payment_id TEXT NOT NULL,
    payment_proof_url TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    bank_branch TEXT NOT NULL,
    payment_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_external_delegation_logic CHECK (
        (delegation_type = 'individual' AND delegation_name IS NULL AND is_head_of_delegation IS NULL AND delegation_sheet_url IS NULL) OR
        (delegation_type = 'group' AND delegation_name IS NOT NULL AND is_head_of_delegation IS NOT NULL
            AND (
                (is_head_of_delegation = TRUE AND delegation_sheet_url IS NOT NULL) OR
                (is_head_of_delegation = FALSE AND delegation_sheet_url IS NULL)
            )
        )
    )
);

CREATE TABLE allocations (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  role user_role_type NOT NULL,
  ip_subrole ip_role_type,
  committee_id UUID,
  country_id UUID,
  is_double_delegation BOOLEAN,
  allocated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT check_allocation_logic CHECK (
    (role = 'delegate' AND committee_id IS NOT NULL AND country_id IS NOT NULL)
    OR
    (role = 'IP' AND committee_id IS NULL AND country_id IS NULL)
  )
);

CREATE UNIQUE INDEX unique_allocations_non_double
ON allocations(committee_id, country_id)
WHERE is_double_delegation = FALSE;
