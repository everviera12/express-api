-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.providers (
    id integer NOT NULL DEFAULT nextval('providers_id_seq'::regclass),
    first_name character varying,
    last_name character varying,
    phone character varying,
    specialty character varying,
    professional_license character varying,
    languages ARRAY,
    locality character varying,
    nationality character varying,
    state character varying,
    municipality character varying,
    CONSTRAINT providers_pkey PRIMARY KEY (id)
);

CREATE TABLE public.role_users (
    id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
    created_at timestamp
    with
        time zone NOT NULL DEFAULT now(),
        user_id uuid NOT NULL DEFAULT gen_random_uuid (),
        role text NOT NULL,
        first_name text,
        last_name text,
        CONSTRAINT role_users_pkey PRIMARY KEY (id),
        CONSTRAINT role_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
);