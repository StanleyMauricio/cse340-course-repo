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