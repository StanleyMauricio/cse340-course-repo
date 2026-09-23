-- created table for organizations
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
-- 1. category table
CREATE TABLE IF NOT EXISTS public.category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. table(M:N)
CREATE TABLE IF NOT EXISTS public.project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project FOREIGN KEY (project_id) 
        REFERENCES public.project(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_category FOREIGN KEY (category_id) 
        REFERENCES public.category(category_id) ON DELETE CASCADE
);

-- 3. Insert categories
INSERT INTO public.category (name) VALUES
('Environment & Sustainability'),
('Community Service & Welfare'),
('Education & Youth Development')
ON CONFLICT (name) DO NOTHING;

-- 4. Assign categories to projects
INSERT INTO public.project_category (project_id, category_id) VALUES
-- Proyects of Organization 1
(1, 1), -- Community Garden Clean Up -> Environment
(2, 2), -- Food Bank Supply Sorting -> Community Service
(3, 3), -- Youth Mentorship Kickoff -> Education
(4, 1), -- Neighborhood Tree Planting -> Environment
(5, 2), -- Winter Clothing Drive -> Community Service

-- Proyects of Organization 2
(6, 1), -- Riverbank Restoration -> Environment
(7, 1), -- Solar Panel Installation -> Environment
(7, 3), -- Solar Panel Installation -> Education (Ejemplo con 2 categorías)
(8, 1), -- E-Waste Recycling Day -> Environment
(9, 1), -- Compost Bin Assembly -> Environment
(10, 1),-- Sustainable Farming -> Environment
(10, 3),-- Sustainable Farming -> Education

-- Proyects of Organization 3
(11, 3),-- Senior Tech Tutoring -> Education
(12, 2),-- Shelter Meal Preparation -> Community Service
(13, 3),-- After-School Homework Club -> Education
(14, 2),-- Community Health Fair Support -> Community Service
(15, 2) -- Holiday Gift Wrapping Drive -> Community Service
ON CONFLICT DO NOTHING;