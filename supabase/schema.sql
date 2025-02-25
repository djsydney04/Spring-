-- Create a table for user profiles
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (id)
);

-- Create a table for activities
CREATE TABLE activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    host_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    location TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    max_participants INTEGER,
    is_private BOOLEAN DEFAULT false,
    auto_approve BOOLEAN DEFAULT true,
    cost DECIMAL(10,2),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create a table for activity participants
CREATE TABLE participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(activity_id, user_id)
);

-- Create a table for activity tags
CREATE TABLE activity_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Create a junction table for activities and tags
CREATE TABLE activity_tag_relations (
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES activity_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (activity_id, tag_id)
);

-- Create a table for messages
CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Activities policies
CREATE POLICY "Activities are viewable by everyone"
    ON activities FOR SELECT
    USING (
        CASE 
            WHEN is_private = false THEN true
            ELSE EXISTS (
                SELECT 1 FROM participants 
                WHERE activity_id = activities.id 
                AND user_id = auth.uid()
            )
        END
    );

CREATE POLICY "Users can insert activities"
    ON activities FOR INSERT
    WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their activities"
    ON activities FOR UPDATE
    USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their activities"
    ON activities FOR DELETE
    USING (auth.uid() = host_id);

-- Participants policies
CREATE POLICY "Users can view participants of their activities"
    ON participants FOR SELECT
    USING (
        auth.uid() IN (
            SELECT host_id FROM activities WHERE id = activity_id
        ) OR
        auth.uid() IN (
            SELECT user_id FROM participants WHERE activity_id = participants.activity_id
        )
    );

CREATE POLICY "Users can request to join activities"
    ON participants FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        NOT EXISTS (
            SELECT 1 FROM participants
            WHERE activity_id = participants.activity_id
            AND user_id = auth.uid()
        )
    );

-- Messages policies
CREATE POLICY "Users can view messages of their activities"
    ON messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM participants
            WHERE activity_id = messages.activity_id
            AND user_id = auth.uid()
            AND status = 'approved'
        ) OR
        EXISTS (
            SELECT 1 FROM activities
            WHERE id = messages.activity_id
            AND host_id = auth.uid()
        )
    );

CREATE POLICY "Participants can insert messages"
    ON messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM participants
            WHERE activity_id = messages.activity_id
            AND user_id = auth.uid()
            AND status = 'approved'
        ) OR
        EXISTS (
            SELECT 1 FROM activities
            WHERE id = messages.activity_id
            AND host_id = auth.uid()
        )
    );

-- Create functions and triggers
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name, avatar_url)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'username',
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user(); 