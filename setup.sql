-- Create tables for the form application

-- Forms table
CREATE TABLE IF NOT EXISTS forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  allow_multiple_submissions BOOLEAN DEFAULT FALSE
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL,
  options TEXT[] NULL,
  required BOOLEAN DEFAULT FALSE,
  order_number INTEGER NOT NULL
);

-- Responses table
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  user_email TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  respondent_ip TEXT
);

-- Answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  response_id UUID NOT NULL REFERENCES responses(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  answer_options TEXT[]
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forms_user_id ON forms(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_form_id ON questions(form_id);
CREATE INDEX IF NOT EXISTS idx_responses_form_id ON responses(form_id);
CREATE INDEX IF NOT EXISTS idx_answers_response_id ON answers(response_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);

-- Create Row Level Security (RLS) policies
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Forms policies
CREATE POLICY "Users can create their own forms" ON forms
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own forms" ON forms
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own forms" ON forms
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forms" ON forms
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public forms can be viewed by anyone" ON forms
  FOR SELECT
  USING (is_public = TRUE);

-- Questions policies
CREATE POLICY "Users can create questions for their forms" ON questions
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM forms WHERE forms.id = form_id AND forms.user_id = auth.uid()
  ));

CREATE POLICY "Users can view questions for their forms" ON questions
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM forms WHERE forms.id = form_id AND forms.user_id = auth.uid()
  ));

CREATE POLICY "Users can update questions for their forms" ON questions
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM forms WHERE forms.id = form_id AND forms.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete questions for their forms" ON questions
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM forms WHERE forms.id = form_id AND forms.user_id = auth.uid()
  ));

CREATE POLICY "Questions for public forms can be viewed by anyone" ON questions
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM forms WHERE forms.id = form_id AND forms.is_public = TRUE
  ));

-- Responses policies
CREATE POLICY "Anyone can create responses" ON responses
  FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Users can view responses for their forms" ON responses
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM forms WHERE forms.id = form_id AND forms.user_id = auth.uid()
  ));

-- Answers policies
CREATE POLICY "Anyone can create answers" ON answers
  FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Users can view answers for their forms" ON answers
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM responses
    JOIN forms ON responses.form_id = forms.id
    WHERE responses.id = response_id AND forms.user_id = auth.uid()
  ));
