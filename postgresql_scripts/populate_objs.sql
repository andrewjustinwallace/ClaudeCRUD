-- Clean up existing data (if needed)
DELETE FROM test.itsetuptasks;
DELETE FROM test.newhires;
DELETE FROM test.itemployees;
DELETE FROM test.setuptypes;
DELETE FROM test.companies;

-- Reset sequences
ALTER SEQUENCE test.companies_companyid_seq RESTART WITH 1;
ALTER SEQUENCE test.itemployees_itemployeeid_seq RESTART WITH 1;
ALTER SEQUENCE test.newhires_newhireid_seq RESTART WITH 1;
ALTER SEQUENCE test.setuptypes_setuptypeid_seq RESTART WITH 1;
ALTER SEQUENCE test.itsetuptasks_itsetuptaskid_seq RESTART WITH 1;

-- Insert Companies
INSERT INTO test.companies (companyname) VALUES
    ('Tech Innovations Inc'),
    ('Digital Solutions Corp'),
    ('Cloud Systems Ltd'),
    ('Data Dynamics'),
    ('Cyber Security Solutions');

-- Insert IT Employees
INSERT INTO test.itemployees (firstname, lastname, email, companyid, hiredate) VALUES
    ('John', 'Smith', 'john.smith@techinnovations.com', 1, '2023-01-15'),
    ('Sarah', 'Johnson', 'sarah.j@techinnovations.com', 1, '2023-02-01'),
    ('Michael', 'Brown', 'michael.b@digitalsolutions.com', 2, '2023-03-10'),
    ('Emily', 'Davis', 'emily.d@cloudsystems.com', 3, '2023-04-15'),
    ('David', 'Wilson', 'david.w@datadynamics.com', 4, '2023-05-20'),
    ('Lisa', 'Anderson', 'lisa.a@cybersecurity.com', 5, '2023-06-25'),
    ('James', 'Taylor', 'james.t@techinnovations.com', 1, '2023-07-01'),
    ('Emma', 'Martinez', 'emma.m@digitalsolutions.com', 2, '2023-08-05'),
    ('Robert', 'Thompson', 'robert.t@cloudsystems.com', 3, '2023-09-10'),
    ('Jennifer', 'Garcia', 'jennifer.g@datadynamics.com', 4, '2023-10-15');

-- Insert Setup Types (if not already present)
INSERT INTO test.setuptypes (setupname, description, estimateddurationminutes) VALUES
    ('Laptop Setup', 'Configure new laptop with standard software and settings', 120),
    ('Email Account', 'Create and configure email account', 30),
    ('VPN Access', 'Set up VPN and remote access', 45),
    ('Security Training', 'Complete initial security awareness training', 60),
    ('Badge Creation', 'Create and activate security badge', 15),
    ('Software Installation', 'Install required department-specific software', 90),
    ('Network Access', 'Configure network drives and permissions', 45),
    ('Phone Setup', 'Set up desk phone and voicemail', 30),
    ('Team Chat Setup', 'Install and configure team communication tools', 20),
    ('Document Access', 'Grant access to document management system', 30);

-- Insert New Hires (mix of recent and upcoming start dates)
INSERT INTO test.newhires (firstname, lastname, email, companyid, hiredate) VALUES
    ('Alice', 'Cooper', 'alice.c@techinnovations.com', 1, CURRENT_DATE - INTERVAL '5 days'),
    ('Bob', 'Miller', 'bob.m@digitalsolutions.com', 2, CURRENT_DATE - INTERVAL '3 days'),
    ('Carol', 'White', 'carol.w@cloudsystems.com', 3, CURRENT_DATE - INTERVAL '1 day'),
    ('Daniel', 'Lee', 'daniel.l@datadynamics.com', 4, CURRENT_DATE),
    ('Eva', 'Harris', 'eva.h@cybersecurity.com', 5, CURRENT_DATE + INTERVAL '1 day'),
    ('Frank', 'Clark', 'frank.c@techinnovations.com', 1, CURRENT_DATE + INTERVAL '3 days'),
    ('Grace', 'Lewis', 'grace.l@digitalsolutions.com', 2, CURRENT_DATE + INTERVAL '5 days'),
    ('Henry', 'Young', 'henry.y@cloudsystems.com', 3, CURRENT_DATE + INTERVAL '7 days'),
    ('Isabel', 'King', 'isabel.k@datadynamics.com', 4, CURRENT_DATE + INTERVAL '10 days'),
    ('Jack', 'Wright', 'jack.w@cybersecurity.com', 5, CURRENT_DATE + INTERVAL '14 days');

-- Insert IT Setup Tasks
-- For past hires (mix of completed and incomplete tasks)
INSERT INTO test.itsetuptasks (itemployeeid, newhireid, setuptypeid, scheduleddate, iscompleted, completeddate, notes) 
SELECT 
    ie.itemployeeid,
    nh.newhireid,
    st.setuptypeid,
    nh.hiredate + (INTERVAL '1 day' * floor(random() * 5)),
    CASE 
        WHEN random() < 0.7 THEN true 
        ELSE false 
    END as iscompleted,
    CASE 
        WHEN random() < 0.7 THEN nh.hiredate + (INTERVAL '1 day' * floor(random() * 3))
        ELSE NULL 
    END as completeddate,
    CASE 
        WHEN random() < 0.3 THEN 'Some setup notes here'
        ELSE NULL 
    END as notes
FROM test.newhires nh
CROSS JOIN test.setuptypes st
JOIN test.itemployees ie ON ie.companyid = nh.companyid
WHERE nh.hiredate <= CURRENT_DATE
ORDER BY random()
LIMIT 50;

-- For future hires (all tasks pending)
INSERT INTO test.itsetuptasks (itemployeeid, newhireid, setuptypeid, scheduleddate, iscompleted) 
SELECT 
    ie.itemployeeid,
    nh.newhireid,
    st.setuptypeid,
    nh.hiredate,
    false
FROM test.newhires nh
CROSS JOIN test.setuptypes st
JOIN test.itemployees ie ON ie.companyid = nh.companyid
WHERE nh.hiredate > CURRENT_DATE
ORDER BY random()
LIMIT 50;

-- Add some overdue tasks
INSERT INTO test.itsetuptasks (itemployeeid, newhireid, setuptypeid, scheduleddate, iscompleted) 
SELECT 
    ie.itemployeeid,
    nh.newhireid,
    st.setuptypeid,
    CURRENT_DATE - (INTERVAL '1 day' * floor(random() * 10)),
    false
FROM test.newhires nh
CROSS JOIN test.setuptypes st
JOIN test.itemployees ie ON ie.companyid = nh.companyid
WHERE nh.hiredate <= CURRENT_DATE
ORDER BY random()
LIMIT 20;

-- Update ModifiedDate for all tables
UPDATE test.companies SET modifieddate = CURRENT_TIMESTAMP;
UPDATE test.itemployees SET modifieddate = CURRENT_TIMESTAMP;
UPDATE test.newhires SET modifieddate = CURRENT_TIMESTAMP;
UPDATE test.setuptypes SET modifieddate = CURRENT_TIMESTAMP;
UPDATE test.itsetuptasks SET modifieddate = CURRENT_TIMESTAMP;