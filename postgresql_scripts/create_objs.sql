-- Create UserTypes table
CREATE TABLE test.UserTypes (
    UserTypeID SERIAL PRIMARY KEY,
    TypeName VARCHAR(50) NOT NULL UNIQUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Companies table
CREATE TABLE test.Companies (
    CompanyID SERIAL PRIMARY KEY,
    CompanyName VARCHAR(100) NOT NULL,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create IT Employees table
CREATE TABLE test.ITEmployees (
    ITEmployeeID SERIAL PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    CompanyID INTEGER,
    HireDate DATE NOT NULL,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_ITEmployees_Companies FOREIGN KEY (CompanyID) 
        REFERENCES test.Companies(CompanyID)
);

-- Create New Hires table
CREATE TABLE test.NewHires (
    NewHireID SERIAL PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    CompanyID INTEGER NOT NULL,
    HireDate DATE NOT NULL,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_NewHires_Companies FOREIGN KEY (CompanyID) 
        REFERENCES test.Companies(CompanyID)
);

-- Create Setup Types table
CREATE TABLE test.SetupTypes (
    SetupTypeID SERIAL PRIMARY KEY,
    SetupName VARCHAR(100) NOT NULL,
    Description VARCHAR(500),
    EstimatedDurationMinutes INTEGER,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create IT Setup Tasks table
CREATE TABLE test.ITSetupTasks (
    ITSetupTaskID SERIAL PRIMARY KEY,
    ITEmployeeID INTEGER NOT NULL,
    NewHireID INTEGER NOT NULL,
    SetupTypeID INTEGER NOT NULL,
    ScheduledDate DATE NOT NULL,
    IsCompleted BOOLEAN DEFAULT FALSE,
    CompletedDate TIMESTAMP,
    Notes VARCHAR(500),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_ITSetupTasks_ITEmployees FOREIGN KEY (ITEmployeeID) 
        REFERENCES test.ITEmployees(ITEmployeeID),
    CONSTRAINT FK_ITSetupTasks_NewHires FOREIGN KEY (NewHireID) 
        REFERENCES test.NewHires(NewHireID),
    CONSTRAINT FK_ITSetupTasks_SetupTypes FOREIGN KEY (SetupTypeID) 
        REFERENCES test.SetupTypes(SetupTypeID)
);

-- Create indexes for better query performance
CREATE INDEX IX_ITEmployees_CompanyID ON test.ITEmployees(CompanyID);
CREATE INDEX IX_NewHires_CompanyID ON test.NewHires(CompanyID);
CREATE INDEX IX_ITSetupTasks_ITEmployeeID ON test.ITSetupTasks(ITEmployeeID);
CREATE INDEX IX_ITSetupTasks_NewHireID ON test.ITSetupTasks(NewHireID);
CREATE INDEX IX_ITSetupTasks_SetupTypeID ON test.ITSetupTasks(SetupTypeID);
CREATE INDEX IX_ITSetupTasks_ScheduledDate ON test.ITSetupTasks(ScheduledDate);

-- Populate Setup Types table with common IT setup tasks
INSERT INTO test.SetupTypes (SetupName, Description, EstimatedDurationMinutes)
VALUES 
    ('Laptop Setup', 'Configure new laptop with standard software and settings', 120),
    ('Email Account Creation', 'Create and configure email account', 30),
    ('Password Setup', 'Create initial password and configure MFA', 15),
    ('Network Access', 'Set up network access and VPN configuration', 45),
    ('Printer Configuration', 'Connect and configure network printers', 20),
    ('Phone Setup', 'Configure desk phone and voicemail', 30),
    ('Software Installation', 'Install required software packages', 90),
    ('Security Training', 'Initial security awareness training', 60),
    ('Badge Creation', 'Create and activate security badge', 15),
    ('Document Access', 'Set up access to document management system', 30),
    ('Remote Access Setup', 'Configure remote access tools and VPN', 45),
    ('Time Tracking Setup', 'Set up time tracking software access', 15),
    ('Chat Software Setup', 'Install and configure chat/collaboration software', 20),
    ('Department Share Access', 'Configure access to department file shares', 30),
    ('Mobile Device Setup', 'Configure company mobile device or BYOD', 45);

-- Create a view to see pending setup tasks
CREATE OR REPLACE VIEW test.vw_PendingSetupTasks AS
SELECT 
    it.FirstName || ' ' || it.LastName AS ITEmployeeName,
    nh.FirstName || ' ' || nh.LastName AS NewHireName,
    c.CompanyName,
    st.SetupName,
    ist.ScheduledDate,
    ist.IsCompleted,
    ist.CompletedDate
FROM test.ITSetupTasks ist
JOIN test.ITEmployees it ON ist.ITEmployeeID = it.ITEmployeeID
JOIN test.NewHires nh ON ist.NewHireID = nh.NewHireID
JOIN test.Companies c ON nh.CompanyID = c.CompanyID
JOIN test.SetupTypes st ON ist.SetupTypeID = st.SetupTypeID
WHERE ist.IsCompleted = FALSE;


-- Add UserType column to ITEmployees
ALTER TABLE test.ITEmployees 
ADD COLUMN UserTypeID INTEGER,
ADD CONSTRAINT FK_ITEmployees_UserTypes 
    FOREIGN KEY (UserTypeID) REFERENCES test.UserTypes(UserTypeID);
    
-- Add the user/pw columns
ALTER TABLE test.itemployees ADD COLUMN username VARCHAR(1000);
ALTER TABLE test.itemployees ADD COLUMN password VARCHAR(1000);

-- Make UserTypeID NOT NULL after updating existing records
ALTER TABLE test.ITEmployees 
ALTER COLUMN UserTypeID SET NOT NULL;


-- Drop the foreign key constraint from ITEmployees to Companies
ALTER TABLE test.ITEmployees 
DROP CONSTRAINT IF EXISTS FK_ITEmployees_Companies;

-- Drop the CompanyID column from ITEmployees
ALTER TABLE test.ITEmployees 
DROP COLUMN IF EXISTS CompanyID;

-- Create IT Employee-Company junction table
CREATE TABLE test.ITEmployeeCompanies (
    ITEmployeeCompanyID SERIAL PRIMARY KEY,
    ITEmployeeID INTEGER NOT NULL,
    CompanyID INTEGER NOT NULL,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_ITEmployeeCompanies_ITEmployees 
        FOREIGN KEY (ITEmployeeID) REFERENCES test.ITEmployees(ITEmployeeID),
    CONSTRAINT FK_ITEmployeeCompanies_Companies 
        FOREIGN KEY (CompanyID) REFERENCES test.Companies(CompanyID),
    CONSTRAINT UQ_ITEmployeeCompany UNIQUE (ITEmployeeID, CompanyID)
);

-- Create index for better query performance
CREATE INDEX IX_ITEmployeeCompanies_ITEmployeeID ON test.ITEmployeeCompanies(ITEmployeeID);
CREATE INDEX IX_ITEmployeeCompanies_CompanyID ON test.ITEmployeeCompanies(CompanyID);

