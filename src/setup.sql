-- 1. Create table organization
CREATE TABLE IF NOT EXISTS public.organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT
);

INSERT INTO public.organization (organization_id, name, description) VALUES
(1, 'Green Earth Initiative', 'Organization focused on environmental conservation.'),
(2, 'EcoTech Alliance', 'Promoting sustainable technology and practices.'),
(3, 'Community Care Network', 'Supporting local welfare and education.')
ON CONFLICT (organization_id) DO NOTHING;

-- 2. Create the table project
CREATE TABLE IF NOT EXISTS public.project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_organization 
        FOREIGN KEY (organization_id) 
        REFERENCES public.organization(organization_id) 
        ON DELETE CASCADE
);

-- 3. insert projects
INSERT INTO public.project (organization_id, title, description, location, project_date) VALUES
-- Organization 1
(1, 'Community Garden Clean Up', 'Volunteers needed to help clear brush and plant veggies.', 'East Side Park', '2026-10-05'),
(1, 'Food Bank Supply Sorting', 'Organizing non-perishable food items for local distribution.', 'Central Warehouse', '2026-10-12'),
(1, 'Youth Mentorship Kickoff', 'Orientation session for new volunteer mentors.', 'Community Center Room B', '2026-10-20'),
(1, 'Neighborhood Tree Planting', 'Planting 50 native trees to improve urban canopy.', 'North Neighborhood', '2026-11-02'),
(1, 'Winter Clothing Drive', 'Collecting and sorting winter coats and accessories.', 'Main Office Depot', '2026-11-15'),

-- Organization 2
(2, 'Riverbank Restoration', 'Cleaning trash and planting grass along the river edge.', 'Green River Trail', '2026-10-08'),
(2, 'Solar Panel Installation Workshop', 'Hands-on training and installation for community roofs.', 'Tech Hub Plaza', '2026-10-18'),
(2, 'E-Waste Recycling Day', 'Collecting outdated electronics for safe recycling.', 'Civic Center Parking Lot', '2026-10-25'),
(2, 'Compost Bin Assembly', 'Building and distributing home compost units.', 'Eco Barn Yard', '2026-11-05'),
(2, 'Sustainable Farming Seminar', 'Educating local urban farmers on soil health.', 'Agriculture Hall', '2026-11-20'),

-- Organization 3
(3, 'Senior Tech Tutoring', 'Teaching seniors how to use smartphones and video calls.', 'Senior Living Complex', '2026-10-10'),
(3, 'Shelter Meal Preparation', 'Cooking and serving hot meals for shelter residents.', 'Downtown Refuge', '2026-10-15'),
(3, 'After-School Homework Club', 'Tutoring elementary students in math and reading.', 'Public Library Annex', '2026-10-28'),
(3, 'Community Health Fair Support', 'Assisting nurses and staff with guest registration.', 'Health Center Pavilion', '2026-11-08'),
(3, 'Holiday Gift Wrapping Drive', 'Wrapping donated toys for children in hospital care.', 'Volunteer Plaza', '2026-11-25');

-- 4. Create the table category
CREATE TABLE IF NOT EXISTS public.category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 5. Create the intermediate table (M:N) project_category
CREATE TABLE IF NOT EXISTS public.project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project FOREIGN KEY (project_id) 
        REFERENCES public.project(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_category FOREIGN KEY (category_id) 
        REFERENCES public.category(category_id) ON DELETE CASCADE
);

-- 6. Insert categories
INSERT INTO public.category (name) VALUES
('Environment & Sustainability'),
('Community Service & Welfare'),
('Education & Youth Development')
ON CONFLICT (name) DO NOTHING;

-- 7. Assign categories to projects
INSERT INTO public.project_category (project_id, category_id) VALUES
(1, 1), 
(2, 2), 
(3, 3), 
(4, 1), 
(5, 2), 
(6, 1), 
(7, 1), 
(7, 3), 
(8, 1), 
(9, 1), 
(10, 1),
(10, 3),
(11, 3),
(12, 2),
(13, 3),
(14, 2),
(15, 2)
ON CONFLICT DO NOTHING;
-- 1. Create the table roles
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

-- 2. Insert initial roles
INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access')
ON CONFLICT (role_name) DO NOTHING;

-- Verify the inserted roles
SELECT * FROM roles;
-- 3. Crear la tabla users
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Insert a test user
INSERT INTO users (name, email, password_hash, role_id) 
VALUES ('testuser', 'test@example.com', 'placeholder_hash', 1)
ON CONFLICT (email) DO NOTHING;

-- Consult the users and their roles 
SELECT u.user_id, u.name, u.email, r.role_name, r.role_description
FROM users u
JOIN roles r ON u.role_id = r.role_id;

-- DELETE the test user after verification
DELETE FROM users WHERE email = 'test@example.com';