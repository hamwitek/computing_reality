-- YOU NEED TO CREATE A USER BEFORE YOU RUN THESE QUERIES, e.g using the register-form
-- Company Types
INSERT INTO company_types (id, name)
VALUES (1, 'Corporation'),
    (2, 'Partnership'),
    (3, 'Sole Proprietorship'),
    (4, 'Non-Profit');
-- Companies
INSERT INTO companies (
        id,
        name,
        postal_code,
        email,
        description,
        analytics_module,
        website,
        company_type_id
    )
VALUES (
        1,
        'Acme Corp',
        '10001',
        'info@acme.com',
        'A leading provider of innovative solutions',
        TRUE,
        'https://www.acme.com',
        1
    ),
    (
        2,
        'TechStart',
        '94107',
        'contact@techstart.io',
        'Technology startup focused on AI applications',
        TRUE,
        'https://www.techstart.io',
        1
    ),
    (
        3,
        'Green Solutions',
        '60611',
        'hello@greensolutions.org',
        'Environmental consulting non-profit',
        FALSE,
        'https://www.greensolutions.org',
        4
    ),
    (
        4,
        'Smith & Partners',
        '02110',
        'info@smithpartners.com',
        'Legal services partnership',
        FALSE,
        'https://www.smithpartners.com',
        2
    );
-- Courses
INSERT INTO courses (id, name, description, created_at, is_active)
VALUES (
        1,
        'Introduction to Python',
        'A beginner-friendly course to learn Python programming basics',
        CURRENT_TIMESTAMP,
        TRUE
    ),
    (
        2,
        'Advanced Data Analysis',
        'Learn advanced techniques for analyzing complex datasets',
        CURRENT_TIMESTAMP,
        TRUE
    ),
    (
        3,
        'Project Management Fundamentals',
        'Core concepts and methodologies of project management',
        CURRENT_TIMESTAMP,
        TRUE
    ),
    (
        4,
        'Leadership Skills',
        'Develop essential leadership skills for the modern workplace',
        CURRENT_TIMESTAMP,
        TRUE
    ),
    (
        5,
        'Environmental Sustainability',
        'Understanding environmental impacts and sustainable practices',
        CURRENT_TIMESTAMP,
        TRUE
    ),
    (
        6,
        'Legacy Systems Maintenance',
        'Maintaining and updating legacy software systems',
        CURRENT_TIMESTAMP,
        FALSE
    );
-- User Course Enrollments
INSERT INTO user_course_enrollments (
        user_id,
        course_id,
        enrolled_at,
        status,
        completion_date,
        grade
    )
VALUES -- John Doe's enrollments
    (
        1,
        1,
        CURRENT_TIMESTAMP - INTERVAL '30 days',
        'COMPLETED',
        CURRENT_TIMESTAMP - INTERVAL '5 days',
        92.5
    ),
    (
        1,
        2,
        CURRENT_TIMESTAMP - INTERVAL '10 days',
        'IN_PROGRESS',
        NULL,
        NULL
    ),
    -- Jane Smith's enrollments
    (
        1,
        3,
        CURRENT_TIMESTAMP - INTERVAL '60 days',
        'COMPLETED',
        CURRENT_TIMESTAMP - INTERVAL '30 days',
        88.0
    ),
    (
        1,
        4,
        CURRENT_TIMESTAMP - INTERVAL '25 days',
        'COMPLETED',
        CURRENT_TIMESTAMP - INTERVAL '2 days',
        94.7
    );