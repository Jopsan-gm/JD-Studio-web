-- Create the products table
create table products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  price numeric not null,
  description text,
  category text,
  images text[],
  is_sold_out boolean default false,
  discount_price numeric
);

-- Enable Row Level Security (RLS)
alter table products enable row level security;

-- Create a policy that allows anyone to read products
create policy "Public profiles are viewable by everyone."
  on products for select
  using ( true );

-- Create a policy that allows authenticated users to insert/update/delete products
-- FOR NOW, to keep it simple with the hardcoded admin password approach,
-- we will allow ALL operations for the anon role but ONLY via the backend API
-- which will use the SERVICE_ROLE key to bypass RLS.
-- So for now, regular users (anon) can only SELECT.

-- If you entered the Service Role Key in the .env file, the backend will bypass RLS automatically.
