-- Create users table (extends profile with app-specific data)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  phone_number TEXT,
  whatsapp_number TEXT,
  subscription_status TEXT DEFAULT 'free' NOT NULL,
  subscription_plan TEXT,
  subscription_id TEXT,
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  sms_enabled BOOLEAN DEFAULT false NOT NULL,
  whatsapp_enabled BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create pets table
CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  breed TEXT,
  birth_date DATE,
  weight NUMERIC,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('food', 'vet', 'grooming', 'toys', 'medication', 'other')),
  description TEXT,
  date DATE NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create symptom_checks table
CREATE TABLE public.symptom_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  symptoms TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  urgency_level TEXT NOT NULL CHECK (urgency_level IN ('high', 'medium', 'low')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create vaccines table
CREATE TABLE public.vaccines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  vaccine_name TEXT NOT NULL,
  due_date DATE NOT NULL,
  completed_date DATE,
  vet_clinic TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create reminders table
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('vaccine', 'medication', 'appointment', 'grooming')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  remind_date TIMESTAMP WITH TIME ZONE NOT NULL,
  sent BOOLEAN DEFAULT false NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('email', 'sms', 'whatsapp')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create usage_tracking table
CREATE TABLE public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  feature TEXT NOT NULL,
  count INTEGER DEFAULT 1 NOT NULL,
  month TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, feature, month)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for pets table
CREATE POLICY "Users can view own pets"
  ON public.pets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own pets"
  ON public.pets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pets"
  ON public.pets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pets"
  ON public.pets FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for expenses table
CREATE POLICY "Users can view own expenses"
  ON public.expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own expenses"
  ON public.expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON public.expenses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON public.expenses FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for symptom_checks table
CREATE POLICY "Users can view own symptom checks"
  ON public.symptom_checks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own symptom checks"
  ON public.symptom_checks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own symptom checks"
  ON public.symptom_checks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own symptom checks"
  ON public.symptom_checks FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for vaccines table (access through pet ownership)
CREATE POLICY "Users can view vaccines for own pets"
  ON public.vaccines FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.pets
    WHERE pets.id = vaccines.pet_id
    AND pets.user_id = auth.uid()
  ));

CREATE POLICY "Users can create vaccines for own pets"
  ON public.vaccines FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.pets
    WHERE pets.id = vaccines.pet_id
    AND pets.user_id = auth.uid()
  ));

CREATE POLICY "Users can update vaccines for own pets"
  ON public.vaccines FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.pets
    WHERE pets.id = vaccines.pet_id
    AND pets.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete vaccines for own pets"
  ON public.vaccines FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.pets
    WHERE pets.id = vaccines.pet_id
    AND pets.user_id = auth.uid()
  ));

-- RLS Policies for reminders table
CREATE POLICY "Users can view own reminders"
  ON public.reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reminders"
  ON public.reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders"
  ON public.reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders"
  ON public.reminders FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for usage_tracking table
CREATE POLICY "Users can view own usage"
  ON public.usage_tracking FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own usage"
  ON public.usage_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage"
  ON public.usage_tracking FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_pets_user_id ON public.pets(user_id);
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX idx_expenses_pet_id ON public.expenses(pet_id);
CREATE INDEX idx_symptom_checks_user_id ON public.symptom_checks(user_id);
CREATE INDEX idx_vaccines_pet_id ON public.vaccines(pet_id);
CREATE INDEX idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX idx_reminders_remind_date ON public.reminders(remind_date);
CREATE INDEX idx_usage_tracking_user_month ON public.usage_tracking(user_id, month);