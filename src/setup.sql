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

-- 3. Insert projects
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

-- 8. Create the table roles
CREATE TABLE IF NOT EXISTS public.roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

-- 9. Insert initial roles
INSERT INTO public.roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access')
ON CONFLICT (role_name) DO NOTHING;

-- 10. Create the table users
CREATE TABLE IF NOT EXISTS public.users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES public.roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Create the volunteers table
CREATE TABLE IF NOT EXISTS public.volunteers (
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, project_id),
    CONSTRAINT fk_volunteer_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_volunteer_project FOREIGN KEY (project_id) REFERENCES public.project(project_id) ON DELETE CASCADE
);

-- 12. Fix / Synchronize sequences to prevent duplicate key errors on inserts
SELECT setval(pg_get_serial_sequence('organization', 'organization_id'), COALESCE(MAX(organization_id), 1)) FROM organization;
SELECT setval(pg_get_serial_sequence('project', 'project_id'), COALESCE(MAX(project_id), 1)) FROM project;
SELECT setval(pg_get_serial_sequence('category', 'category_id'), COALESCE(MAX(category_id), 1)) FROM category;
SELECT setval(pg_get_serial_sequence('roles', 'role_id'), COALESCE(MAX(role_id), 1)) FROM roles;
SELECT setval(pg_get_serial_sequence('users', 'user_id'), COALESCE(MAX(user_id), 1)) FROM users;
SELECT setval(pg_get_serial_sequence('organization', 'organization_id'), COALESCE(MAX(organization_id), 1)) FROM organization;