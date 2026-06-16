-- Add superadmin to user_role enum (must be in its own migration transaction)

ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'superadmin';
