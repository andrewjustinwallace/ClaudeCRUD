-- example usage of the functions:
/*
select * from test.get_it_employee_pending_tasks(5);
select * from test.get_new_hire_setup_status(1);
select * from test.get_it_employee_workload();
select * from test.get_todays_tasks();
select * from test.get_company_onboarding_progress(1);
select * from test.get_overdue_tasks(4);
select * from test.update_task_completion(111, 5, 4, 'asdf')
select * from test.authenticate_user('it', 'it')

select * from test.itsetuptasks where itsetuptaskid = 111
select * from test.ITEmployees

drop function test.get_new_hire_setup_status;
drop function test.get_it_employee_pending_tasks;
drop function test.get_it_employee_workload;
drop function test.get_todays_tasks;
drop function test.get_company_onboarding_progress;
drop function test.get_overdue_tasks;

update test.itemployees set username = 'testadminuser', password = 'test123test' where itemployeeid = 1
SELECT * FROM test.get_active_companies()
SELECT * FROM test.get_new_hires()
SELECT * FROM test.get_it_employees()
*/




-- get all pending tasks for a specific it employee
CREATE OR REPLACE FUNCTION test.get_it_employee_pending_tasks(
    p_it_employee_id integer,
    p_company_id integer
)
RETURNS TABLE (
    taskid integer,
    newhireid integer,
    newhirename text,
    setuptype varchar(100),
    scheduleddate date,
    iscompleted boolean,
    companyname varchar(100),
    details varchar(1000)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ist.itsetuptaskid,
        nh.newhireid,
        nh.firstname || ' ' || nh.lastname,
        st.setupname,
        ist.scheduleddate,
        ist.iscompleted,
        c.companyname,
        ist.details
    FROM test.itsetuptasks ist
    JOIN test.newhires nh ON ist.newhireid = nh.newhireid
    JOIN test.setuptypes st ON ist.setuptypeid = st.setuptypeid
    JOIN test.companies c ON nh.companyid = c.companyid
    JOIN test.ITEmployeeCompanies iec ON ist.ITEmployeeID = iec.ITEmployeeID 
        AND nh.CompanyID = iec.CompanyID
    WHERE ist.itemployeeid = p_it_employee_id
    AND nh.companyid = p_company_id
    ORDER BY ist.scheduleddate;
END;
$$ LANGUAGE plpgsql;


-- get all setup tasks for a specific new hire
create or replace function test.get_new_hire_setup_status(p_new_hire_id integer)
returns table (
    setuptype varchar(100),
    itemployeename text,
    scheduleddate date,
    iscompleted boolean,
    completeddate timestamp
) as $$
begin
    return query
    select 
        st.setupname,
        ite.firstname || ' ' || ite.lastname,
        ist.scheduleddate,
        ist.iscompleted,
        ist.completeddate
    from test.itsetuptasks ist
    join test.itemployees ite on ist.itemployeeid = ite.itemployeeid
    join test.setuptypes st on ist.setuptypeid = st.setuptypeid
    where ist.newhireid = p_new_hire_id
    order by ist.scheduleddate, st.setupname;
end;
$$ language plpgsql;

-- get workload summary for it employees
create or replace function test.get_it_employee_workload(p_company_Id integer)
returns table (
    itemployeeid integer,
    itemployeename text,
    pendingtasks bigint,
    completedtasks bigint,
    totaltasks bigint,
    companyname varchar(100),
    companyid integer 
) as $$
begin
    return query
    select 
		ite.itemployeeid,
        ite.firstname || ' ' || ite.lastname,
        count(case when ist.iscompleted = false then 1 end),
        count(case when ist.iscompleted = true then 1 end),
        count(*),
        c.companyname,
		c.companyid
    from test.itemployees ite
    left join test.itsetuptasks ist on ite.itemployeeid = ist.itemployeeid
	JOIN test.ITEmployeeCompanies iec ON ist.ITEmployeeID = iec.ITEmployeeID
    left join test.companies c on iec.companyid = c.companyid
	where c.companyId = p_company_Id
    group by ite.itemployeeid, ite.firstname, ite.lastname, c.companyname, c.companyid
    order by pendingtasks desc;
end;
$$ language plpgsql;

-- get tasks scheduled for today
create or replace function test.get_todays_tasks()
returns table (
    taskid integer,
    itemployeename text,
    newhirename text,
    setuptype varchar(100),
    iscompleted boolean,
    companyname varchar(100)
) as $$
begin
    return query
    select 
        ist.itsetuptaskid,
        ite.firstname || ' ' || ite.lastname,
        nh.firstname || ' ' || nh.lastname,
        st.setupname,
        ist.iscompleted,
        c.companyname
    from test.itsetuptasks ist
    join test.itemployees ite on ist.itemployeeid = ite.itemployeeid
    join test.newhires nh on ist.newhireid = nh.newhireid
    join test.setuptypes st on ist.setuptypeid = st.setuptypeid
    join test.companies c on nh.companyid = c.companyid
    where ist.scheduleddate = current_date
    order by ite.lastname, ite.firstname;
end;
$$ language plpgsql;

-- get company onboarding progress
create or replace function test.get_company_onboarding_progress(p_company_id integer)
returns table (
    newhirename text,
    totaltasks bigint,
    completedtasks bigint,
    completionpercentage numeric,
    hiredate date
) as $$
begin
    return query
    select 
        nh.firstname || ' ' || nh.lastname,
        count(*),
        count(case when ist.iscompleted = true then 1 end),
        round(count(case when ist.iscompleted = true then 1 end)::numeric / count(*)::numeric * 100, 2),
        nh.hiredate
    from test.newhires nh
    left join test.itsetuptasks ist on nh.newhireid = ist.newhireid
    where nh.companyid = p_company_id
    group by nh.newhireid, nh.firstname, nh.lastname, nh.hiredate
    order by nh.hiredate desc;
end;
$$ language plpgsql;

-- get overdue tasks
CREATE OR REPLACE FUNCTION test.get_overdue_tasks(
    p_it_employee_id integer,
    p_company_id integer
)
RETURNS TABLE (
    itsetuptaskid integer,
    itemployeename text,
    newhirename text,
    setuptype varchar(100),
    scheduleddate date,
    daysoverdue integer,
    companyname varchar(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ist.itsetuptaskid,
        ite.firstname || ' ' || ite.lastname,
        nh.firstname || ' ' || nh.lastname,
        st.setupname,
        ist.scheduleddate,
        (current_date - ist.scheduleddate)::integer,
        c.companyname
    FROM test.itsetuptasks ist
    JOIN test.itemployees ite ON ist.itemployeeid = ite.itemployeeid
    JOIN test.newhires nh ON ist.newhireid = nh.newhireid
    JOIN test.setuptypes st ON ist.setuptypeid = st.setuptypeid
    JOIN test.companies c ON nh.companyid = c.companyid
    JOIN test.ITEmployeeCompanies iec ON ist.ITEmployeeID = iec.ITEmployeeID 
        AND nh.CompanyID = iec.CompanyID
    WHERE ist.iscompleted = false
    AND ist.scheduleddate < current_date
    AND ist.itemployeeid = p_it_employee_id
    AND nh.companyid = p_company_id
    ORDER BY daysoverdue desc;
END;
$$ LANGUAGE plpgsql;


-- Function to update task completion status
CREATE OR REPLACE FUNCTION test.update_task_completion(
    p_task_id INTEGER,
    p_it_employee_id INTEGER,
    p_new_hire_id INTEGER,
    p_notes VARCHAR(500)
)
RETURNS BOOLEAN AS $$
DECLARE
    v_task_exists BOOLEAN;
BEGIN
    -- Verify the task exists and belongs to the specified IT employee and new hire
    SELECT EXISTS (
        SELECT 1 
        FROM test.itsetuptasks 
        WHERE itsetuptaskid = p_task_id 
        AND itemployeeid = p_it_employee_id
        AND newhireid = p_new_hire_id
        AND iscompleted = FALSE
    ) INTO v_task_exists;

    IF NOT v_task_exists THEN
        RETURN FALSE;
    END IF;

    -- Update the task
    UPDATE test.itsetuptasks
    SET 
        iscompleted = TRUE,
        completeddate = CURRENT_TIMESTAMP,
        notes = p_notes,
        modifieddate = CURRENT_TIMESTAMP
    WHERE itsetuptaskid = p_task_id
    AND itemployeeid = p_it_employee_id
    AND newhireid = p_new_hire_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create login function
CREATE OR REPLACE FUNCTION test.get_authenticated_user(
    p_username VARCHAR,
    p_password VARCHAR
)
RETURNS TABLE (
    authenticated BOOLEAN,
    employeeid INTEGER,
    firstname VARCHAR,
    lastname VARCHAR,
    usertype VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TRUE as authenticated,
        e.ITEmployeeID,
        e.FirstName,
        e.LastName,
        ut.TypeName as user_type
    FROM test.ITEmployees e
    JOIN test.UserTypes ut ON e.UserTypeID = ut.UserTypeID
    WHERE e.Username = p_username 
    AND e.Password = p_password;
END;
$$ LANGUAGE plpgsql;

-- Get user's companies function
CREATE OR REPLACE FUNCTION test.get_employee_companies(
    p_employee_id INTEGER
)
RETURNS TABLE (
    companyid INTEGER,
    companyname VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.CompanyID,
        c.CompanyName
    FROM test.ITEmployeeCompanies ec
    JOIN test.Companies c ON ec.CompanyID = c.CompanyID
    WHERE ec.ITEmployeeID = p_employee_id;
END;
$$ LANGUAGE plpgsql;


-- UserType Management Functions
CREATE OR REPLACE FUNCTION test.upsert_user_type(
    p_user_type_id INTEGER,
    p_type_name VARCHAR(50)
)
RETURNS INTEGER AS $$
DECLARE
    v_user_type_id INTEGER;
BEGIN
    IF p_user_type_id IS NULL OR p_user_type_id = 0 THEN
        -- Insert new record
        INSERT INTO test.UserTypes (TypeName, CreatedDate, ModifiedDate)
        VALUES (p_type_name, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING UserTypeID INTO v_user_type_id;
    ELSE
        -- Update existing record
        UPDATE test.UserTypes
        SET TypeName = p_type_name,
            ModifiedDate = CURRENT_TIMESTAMP
        WHERE UserTypeID = p_user_type_id
        RETURNING UserTypeID INTO v_user_type_id;
    END IF;
    
    RETURN v_user_type_id;
END;
$$ LANGUAGE plpgsql;

-- Company Management Functions
CREATE OR REPLACE FUNCTION test.upsert_company(
    p_company_id INTEGER,
    p_company_name VARCHAR(100),
    p_is_active BOOLEAN DEFAULT TRUE
)
RETURNS INTEGER AS $$
DECLARE
    v_company_id INTEGER;
BEGIN
    IF p_company_id IS NULL OR p_company_id = 0 THEN
        -- Insert new record
        INSERT INTO test.Companies (CompanyName, CreatedDate, ModifiedDate, IsActive)
        VALUES (p_company_name, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, p_is_active)
        RETURNING CompanyID INTO v_company_id;
    ELSE
        -- Update existing record
        UPDATE test.Companies
        SET CompanyName = p_company_name,
            IsActive = p_is_active,
            ModifiedDate = CURRENT_TIMESTAMP
        WHERE CompanyID = p_company_id
        RETURNING CompanyID INTO v_company_id;
    END IF;
    
    RETURN v_company_id;
END;
$$ LANGUAGE plpgsql;

-- SetupType Management Functions
CREATE OR REPLACE FUNCTION test.upsert_setup_type(
    p_setup_type_id INTEGER,
    p_setup_name VARCHAR(100),
    p_description VARCHAR(500),
    p_estimated_duration_minutes INTEGER,
    p_is_active BOOLEAN DEFAULT TRUE
)
RETURNS INTEGER AS $$
DECLARE
    v_setup_type_id INTEGER;
BEGIN
    IF p_setup_type_id IS NULL OR p_setup_type_id = 0 THEN
        -- Insert new record
        INSERT INTO test.SetupTypes (
            SetupName, 
            Description, 
            EstimatedDurationMinutes,
            IsActive,
            CreatedDate, 
            ModifiedDate
        )
        VALUES (
            p_setup_name, 
            p_description, 
            p_estimated_duration_minutes,
            p_is_active,
            CURRENT_TIMESTAMP, 
            CURRENT_TIMESTAMP
        )
        RETURNING SetupTypeID INTO v_setup_type_id;
    ELSE
        -- Update existing record
        UPDATE test.SetupTypes
        SET SetupName = p_setup_name,
            Description = p_description,
            EstimatedDurationMinutes = p_estimated_duration_minutes,
            IsActive = p_is_active,
            ModifiedDate = CURRENT_TIMESTAMP
        WHERE SetupTypeID = p_setup_type_id
        RETURNING SetupTypeID INTO v_setup_type_id;
    END IF;
    
    RETURN v_setup_type_id;
END;
$$ LANGUAGE plpgsql;

-- IT Employee Management Functions
--select * from test.upsert_it_employee(6, 'asdf', 'asdf', 'asdf', '2024-12-17', 2, 'asdf', 'asdf', true)

CREATE OR replace FUNCTION test.upsert_it_employee(
    p_it_employee_id INTEGER,
    p_first_name TEXT,
    p_last_name TEXT,
    p_email TEXT,
    p_hire_date TEXT,
    p_user_type_id INTEGER,
    p_username TEXT,
    p_password TEXT,
    p_is_active BOOLEAN DEFAULT TRUE
)
RETURNS INTEGER AS $$
DECLARE
    v_it_employee_id INTEGER;
BEGIN
    IF p_it_employee_id IS NULL OR p_it_employee_id = 0 THEN
        -- Insert new record
        INSERT INTO test.ITEmployees (
            FirstName,
            LastName,
            Email,
            HireDate,
            UserTypeID,
            Username,
            Password,
            IsActive,
            CreatedDate,
            ModifiedDate
        )
        VALUES (
            p_first_name,
            p_last_name,
            p_email,
            to_date(p_hire_date, 'YYYY-MM-DD'),
            p_user_type_id,
            p_username,
            p_password,
            p_is_active,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )
        RETURNING ITEmployeeID INTO v_it_employee_id;
    ELSE
        -- Update existing record
        UPDATE test.ITEmployees
        SET FirstName = p_first_name,
            LastName = p_last_name,
            Email = p_email,
            HireDate = to_date(p_hire_date, 'YYYY-MM-DD'),
            UserTypeID = p_user_type_id,
            Username = p_username,
            Password = CASE WHEN p_password IS NOT NULL THEN p_password ELSE Password END,
            IsActive = p_is_active,
            ModifiedDate = CURRENT_TIMESTAMP
        WHERE ITEmployeeID = p_it_employee_id
        RETURNING ITEmployeeID INTO v_it_employee_id;
    END IF;
    
    RETURN v_it_employee_id;
END;
$$ LANGUAGE plpgsql;

-- New Hire Management Functions
CREATE OR REPLACE FUNCTION test.upsert_new_hire(
    p_new_hire_id INTEGER,
    p_first_name VARCHAR(50),
    p_last_name VARCHAR(50),
    p_email VARCHAR(100),
    p_company_id INTEGER,
    p_hire_date text,
    p_is_active BOOLEAN DEFAULT TRUE
)
RETURNS INTEGER AS $$
DECLARE
    v_new_hire_id INTEGER;
BEGIN
    IF p_new_hire_id IS NULL OR p_new_hire_id = 0 THEN
        -- Insert new record
        INSERT INTO test.NewHires (
            FirstName,
            LastName,
            Email,
            CompanyID,
            HireDate,
            IsActive,
            CreatedDate,
            ModifiedDate
        )
        VALUES (
            p_first_name,
            p_last_name,
            p_email,
            p_company_id,
			to_date(p_hire_date, 'YYYY-MM-DD'),
            p_is_active,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )
        RETURNING NewHireID INTO v_new_hire_id;
    ELSE
        -- Update existing record
        UPDATE test.NewHires
        SET FirstName = p_first_name,
            LastName = p_last_name,
            Email = p_email,
            CompanyID = p_company_id,
            HireDate = to_date(p_hire_date, 'YYYY-MM-DD'),
            IsActive = p_is_active,
            ModifiedDate = CURRENT_TIMESTAMP
        WHERE NewHireID = p_new_hire_id
        RETURNING NewHireID INTO v_new_hire_id;
    END IF;
    
    RETURN v_new_hire_id;
END;
$$ LANGUAGE plpgsql;

-- IT Employee Company Assignment Functions
CREATE OR REPLACE FUNCTION test.assign_company_to_employee(
    p_it_employee_id INTEGER,
    p_company_id INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if assignment already exists
    IF NOT EXISTS (
        SELECT 1 
        FROM test.ITEmployeeCompanies 
        WHERE ITEmployeeID = p_it_employee_id 
        AND CompanyID = p_company_id
    ) THEN
        -- Create new assignment
        INSERT INTO test.ITEmployeeCompanies (
            ITEmployeeID,
            CompanyID,
            CreatedDate,
            ModifiedDate
        )
        VALUES (
            p_it_employee_id,
            p_company_id,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION test.remove_company_from_employee(
    p_it_employee_id INTEGER,
    p_company_id INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM test.ITEmployeeCompanies
    WHERE ITEmployeeID = p_it_employee_id
    AND CompanyID = p_company_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- IT Setup Task Management Functions
CREATE OR REPLACE FUNCTION test.upsert_setup_task(
    p_it_setup_task_id INTEGER,
    p_it_employee_id INTEGER,
    p_new_hire_id INTEGER,
    p_setup_type_id INTEGER,
    p_scheduled_date DATE,
    p_is_completed BOOLEAN,
    p_completed_date TIMESTAMP,
    p_notes VARCHAR(500),
    p_details VARCHAR(1000)
)
RETURNS INTEGER AS $$
DECLARE
    v_it_setup_task_id INTEGER;
BEGIN
    IF p_it_setup_task_id IS NULL OR p_it_setup_task_id = 0 THEN
        -- Insert new record
        INSERT INTO test.ITSetupTasks (
            ITEmployeeID,
            NewHireID,
            SetupTypeID,
            ScheduledDate,
            IsCompleted,
            CompletedDate,
            Notes,
            Details,
            CreatedDate,
            ModifiedDate
        )
        VALUES (
            p_it_employee_id,
            p_new_hire_id,
            p_setup_type_id,
            p_scheduled_date,
            p_is_completed,
            p_completed_date,
            p_notes,
            p_details,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )
        RETURNING ITSetupTaskID INTO v_it_setup_task_id;
    ELSE
        -- Update existing record
        UPDATE test.ITSetupTasks
        SET ITEmployeeID = p_it_employee_id,
            NewHireID = p_new_hire_id,
            SetupTypeID = p_setup_type_id,
            ScheduledDate = p_scheduled_date,
            IsCompleted = p_is_completed,
            CompletedDate = p_completed_date,
            Notes = p_notes,
            Details = p_details,
            ModifiedDate = CURRENT_TIMESTAMP
        WHERE ITSetupTaskID = p_it_setup_task_id
        RETURNING ITSetupTaskID INTO v_it_setup_task_id;
    END IF;
    
    RETURN v_it_setup_task_id;
END;
$$ LANGUAGE plpgsql;

-- Monitoring Functions

CREATE OR REPLACE FUNCTION test.get_active_companies()
RETURNS TABLE (
    CompanyId INTEGER,
    CompanyName VARCHAR(100),
    CreatedDate TIMESTAMP,
    ModifiedDate TIMESTAMP,
    IsActive bool
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.CompanyId,
        c.CompanyName,
        c.CreatedDate,
        c.ModifiedDate,
        c.IsActive
    FROM test.Companies c
    ORDER BY c.CompanyName;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION test.get_active_setup_types()
RETURNS TABLE (
    setuptypeid INTEGER,
    setupname VARCHAR(100),
    description VARCHAR(500),
    estimateddurationminutes INTEGER,
    createddate TIMESTAMP,
    modifieddate TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        st.SetupTypeID,
        st.SetupName,
        st.Description,
        st.EstimatedDurationMinutes,
        st.CreatedDate,
        st.ModifiedDate
    FROM test.SetupTypes st
    WHERE st.IsActive = TRUE
    ORDER BY st.SetupName;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION test.get_user_types()
RETURNS TABLE (
    user_type_id INTEGER,
    type_name VARCHAR(50),
    created_date TIMESTAMP,
    modified_date TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        UserTypeID,
        TypeName,
        CreatedDate,
        ModifiedDate
    FROM test.UserTypes
    ORDER BY TypeName;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION test.get_it_employees()
RETURNS TABLE (
    itemployeeid INTEGER,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    email VARCHAR(100),
    hiredate DATE,
    usertypeid INTEGER,
    usertypename VARCHAR(50),
    createddate TIMESTAMP,
    modifieddate TIMESTAMP,
    isactive bool,
    companyCount bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.ITEmployeeID,
        e.FirstName,
        e.LastName,
        e.Email,
        e.HireDate,
        e.UserTypeID,
        ut.TypeName,
        e.CreatedDate,
        e.ModifiedDate,
		e.IsActive,
		count(c.CompanyId)
    FROM test.ITEmployees e
    JOIN test.UserTypes ut ON e.UserTypeID = ut.UserTypeID
	left JOIN test.ITEmployeeCompanies ec ON e.ITEmployeeID = ec.ITEmployeeID
	left JOIN test.Companies c ON ec.CompanyID = c.CompanyID
	group by e.ITEmployeeID, e.FirstName, e.LastName, e.Email, e.HireDate
		, e.UserTypeID, ut.TypeName, e.CreatedDate, e.ModifiedDate, e.IsActive
    ORDER BY e.LastName, e.FirstName;
END;
$$ LANGUAGE plpgsql;


--select * from test.get_it_employee(18)
CREATE OR REPLACE FUNCTION test.get_it_employee(p_itemployee_id integer)
RETURNS TABLE (
    itemployeeid INTEGER,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    email VARCHAR(100),
    hiredate DATE,
    usertypeid INTEGER,
    usertypename VARCHAR(50),
    createddate TIMESTAMP,
    modifieddate TIMESTAMP,
    isactive bool
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.ITEmployeeID,
        e.FirstName,
        e.LastName,
        e.Email,
        e.HireDate,
        e.UserTypeID,
        ut.TypeName,
        e.CreatedDate,
        e.ModifiedDate,
		e.IsActive
    FROM test.ITEmployees e
    JOIN test.UserTypes ut ON e.UserTypeID = ut.UserTypeID
	where e.itemployeeid = p_itemployee_id
    ORDER BY e.LastName, e.FirstName;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION test.get_new_hires()
RETURNS TABLE (
    newhireid INTEGER,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    email VARCHAR(100),
    companyid INTEGER,
    companyname VARCHAR(100),
    startdate DATE,
    createddate TIMESTAMP,
    modifieddate TIMESTAMP,
    isactive bool
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        nh.NewHireID,
        nh.FirstName,
        nh.LastName,
        nh.Email,
        nh.CompanyID,
        c.CompanyName,
        nh.HireDate,
        nh.CreatedDate,
        nh.ModifiedDate,
		nh.IsActive
    FROM test.NewHires nh
    JOIN test.Companies c ON nh.CompanyID = c.CompanyID
    ORDER BY nh.HireDate DESC, nh.LastName, nh.FirstName;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION test.get_new_hire_by_id(p_newhire_id integer)
RETURNS TABLE (
    newhireid INTEGER,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    email VARCHAR(100),
    companyid INTEGER,
    companyname VARCHAR(100),
    startdate DATE,
    createddate TIMESTAMP,
    modifieddate TIMESTAMP,
    isactive bool
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        nh.NewHireID,
        nh.FirstName,
        nh.LastName,
        nh.Email,
        nh.CompanyID,
        c.CompanyName,
        nh.HireDate,
        nh.CreatedDate,
        nh.ModifiedDate,
		nh.IsActive
    FROM test.NewHires nh
    JOIN test.Companies c ON nh.CompanyID = c.CompanyID
	WHERE nh.NewHireID = p_newhire_id
    ORDER BY nh.HireDate DESC, nh.LastName, nh.FirstName;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION test.get_employee_company_assignments(
    p_it_employee_id INTEGER
)
RETURNS TABLE (
    company_id INTEGER,
    company_name VARCHAR(100),
    created_date TIMESTAMP,
    modified_date TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.CompanyID,
        c.CompanyName,
        ec.CreatedDate,
        ec.ModifiedDate
    FROM test.ITEmployeeCompanies ec
    JOIN test.Companies c ON ec.CompanyID = c.CompanyID
    WHERE ec.ITEmployeeID = p_it_employee_id
    ORDER BY c.CompanyName;
END;
$$ LANGUAGE plpgsql;


-- Task Assignment Monitoring
CREATE OR REPLACE FUNCTION test.get_task_assignments_by_company(
    p_company_id INTEGER
)
RETURNS TABLE (
    task_id INTEGER,
    setup_type VARCHAR(100),
    it_employee_name TEXT,
    new_hire_name TEXT,
    scheduled_date DATE,
    is_completed BOOLEAN,
    completed_date TIMESTAMP,
    notes VARCHAR(500),
    details VARCHAR(1000),
    created_date TIMESTAMP,
    modified_date TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.ITSetupTaskID,
        st.SetupName,
        e.FirstName || ' ' || e.LastName,
        nh.FirstName || ' ' || nh.LastName,
        t.ScheduledDate,
        t.IsCompleted,
        t.CompletedDate,
        t.Notes,
        t.Details,
        t.CreatedDate,
        t.ModifiedDate
    FROM test.ITSetupTasks t
    JOIN test.SetupTypes st ON t.SetupTypeID = st.SetupTypeID
    JOIN test.ITEmployees e ON t.ITEmployeeID = e.ITEmployeeID
    JOIN test.NewHires nh ON t.NewHireID = nh.NewHireID
    WHERE nh.CompanyID = p_company_id
    ORDER BY t.ScheduledDate DESC, nh.LastName, nh.FirstName;
END;
$$ LANGUAGE plpgsql;

-- Workload Distribution Analysis
CREATE OR REPLACE FUNCTION test.get_company_workload_distribution(
    p_company_id INTEGER
)
RETURNS TABLE (
    it_employee_id INTEGER,
    employee_name TEXT,
    total_tasks BIGINT,
    completed_tasks BIGINT,
    pending_tasks BIGINT,
    overdue_tasks BIGINT,
    avg_completion_days NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.ITEmployeeID,
        e.FirstName || ' ' || e.LastName,
        COUNT(t.ITSetupTaskID),
        COUNT(t.ITSetupTaskID) FILTER (WHERE t.IsCompleted = TRUE),
        COUNT(t.ITSetupTaskID) FILTER (WHERE t.IsCompleted = FALSE),
        COUNT(t.ITSetupTaskID) FILTER (WHERE t.IsCompleted = FALSE AND t.ScheduledDate < CURRENT_DATE),
        AVG(EXTRACT(DAY FROM (t.CompletedDate - t.ScheduledDate))) FILTER (WHERE t.IsCompleted = TRUE)
    FROM test.ITEmployees e
    JOIN test.ITEmployeeCompanies ec ON e.ITEmployeeID = ec.ITEmployeeID
    LEFT JOIN test.ITSetupTasks t ON e.ITEmployeeID = t.ITEmployeeID
    WHERE ec.CompanyID = p_company_id
    AND e.IsActive = TRUE
    GROUP BY e.ITEmployeeID, e.FirstName, e.LastName
    ORDER BY pending_tasks DESC, employee_name;
END;
$$ LANGUAGE plpgsql;

-- Setup Type Analysis
CREATE OR REPLACE FUNCTION test.get_setup_type_statistics()
RETURNS TABLE (
    setup_type_id INTEGER,
    setup_name VARCHAR(100),
    total_tasks BIGINT,
    avg_completion_time NUMERIC,
    success_rate NUMERIC,
    estimated_duration INTEGER,
    actual_avg_duration NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        st.SetupTypeID,
        st.SetupName,
        COUNT(t.ITSetupTaskID),
        AVG(EXTRACT(EPOCH FROM (t.CompletedDate - t.ScheduledDate))/3600)::NUMERIC,
        (COUNT(t.ITSetupTaskID) FILTER (WHERE t.IsCompleted = TRUE) * 100.0 / 
            NULLIF(COUNT(t.ITSetupTaskID), 0))::NUMERIC,
        st.EstimatedDurationMinutes,
        AVG(EXTRACT(EPOCH FROM (t.CompletedDate - t.ScheduledDate))/60)::NUMERIC
    FROM test.SetupTypes st
    LEFT JOIN test.ITSetupTasks t ON st.SetupTypeID = t.SetupTypeID
    WHERE st.IsActive = TRUE
    GROUP BY st.SetupTypeID, st.SetupName, st.EstimatedDurationMinutes
    ORDER BY total_tasks DESC;
END;
$$ LANGUAGE plpgsql;



-- New Hire Onboarding Status
CREATE OR REPLACE FUNCTION test.get_new_hire_onboarding_status(
    p_company_id INTEGER
)
RETURNS TABLE (
    new_hire_id INTEGER,
    new_hire_name TEXT,
    hire_date DATE,
    total_tasks BIGINT,
    completed_tasks BIGINT,
    pending_tasks BIGINT,
    completion_percentage NUMERIC,
    days_until_start INTEGER,
    is_overdue BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        nh.NewHireID,
        nh.FirstName || ' ' || nh.LastName,
        nh.HireDate,
        COUNT(t.ITSetupTaskID),
        COUNT(t.ITSetupTaskID) FILTER (WHERE t.IsCompleted = TRUE),
        COUNT(t.ITSetupTaskID) FILTER (WHERE t.IsCompleted = FALSE),
        (COUNT(t.ITSetupTaskID) FILTER (WHERE t.IsCompleted = TRUE) * 100.0 / 
            NULLIF(COUNT(t.ITSetupTaskID), 0))::NUMERIC,
        (nh.HireDate - CURRENT_DATE)::INTEGER,
        CASE 
            WHEN nh.HireDate <= CURRENT_DATE AND 
                 EXISTS (SELECT 1 FROM test.ITSetupTasks st 
                        WHERE st.NewHireID = nh.NewHireID 
                        AND st.IsCompleted = FALSE) 
            THEN TRUE 
            ELSE FALSE 
        END
    FROM test.NewHires nh
    LEFT JOIN test.ITSetupTasks t ON nh.NewHireID = t.NewHireID
    WHERE nh.CompanyID = p_company_id
    AND nh.IsActive = TRUE
    GROUP BY nh.NewHireID, nh.FirstName, nh.LastName, nh.HireDate
    ORDER BY nh.HireDate, new_hire_name;
END;
$$ LANGUAGE plpgsql;



-- Company Statistics
CREATE OR REPLACE FUNCTION test.get_company_statistics()
RETURNS TABLE (
    company_id INTEGER,
    company_name VARCHAR(100),
    total_employees BIGINT,
    total_new_hires BIGINT,
    pending_setups BIGINT,
    completed_setups BIGINT,
    overdue_tasks BIGINT,
    avg_completion_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.CompanyID,
        c.CompanyName,
        COUNT(DISTINCT ec.ITEmployeeID),
        COUNT(DISTINCT nh.NewHireID),
        COUNT(t.ITSetupTaskID) FILTER (WHERE t.IsCompleted = FALSE),
        COUNT(t.ITSetupTaskID) FILTER (WHERE t.IsCompleted = TRUE),
        COUNT(t.ITSetupTaskID) FILTER (WHERE t.IsCompleted = FALSE AND t.ScheduledDate < CURRENT_DATE),
        (COUNT(t.ITSetupTaskID) FILTER (WHERE t.IsCompleted = TRUE) * 100.0 / 
            NULLIF(COUNT(t.ITSetupTaskID), 0))::NUMERIC
    FROM test.Companies c
    LEFT JOIN test.ITEmployeeCompanies ec ON c.CompanyID = ec.CompanyID
    LEFT JOIN test.NewHires nh ON c.CompanyID = nh.CompanyID AND nh.IsActive = TRUE
    LEFT JOIN test.ITSetupTasks t ON nh.NewHireID = t.NewHireID
    WHERE c.IsActive = TRUE
    GROUP BY c.CompanyID, c.CompanyName
    ORDER BY c.CompanyName;
END;
$$ LANGUAGE plpgsql;



-- Audit Trail Function
CREATE OR REPLACE FUNCTION test.get_recent_changes(
    p_company_id INTEGER,
    p_days INTEGER DEFAULT 7
)
RETURNS TABLE (
    entity_type TEXT,
    entity_id INTEGER,
    entity_name TEXT,
    action_type TEXT,
    modified_date TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    -- Company changes
    SELECT 
        'Company'::TEXT,
        CompanyID,
        CompanyName,
        CASE 
            WHEN CreatedDate > CURRENT_TIMESTAMP - (p_days || ' days')::INTERVAL THEN 'Created'
            ELSE 'Modified'
        END,
        GREATEST(CreatedDate, ModifiedDate)
    FROM test.Companies
    WHERE CompanyID = p_company_id
    AND GREATEST(CreatedDate, ModifiedDate) > CURRENT_TIMESTAMP - (p_days || ' days')::INTERVAL
    
    UNION ALL
    
    -- IT Employee changes
    SELECT 
        'IT Employee'::TEXT,
        e.ITEmployeeID,
        e.FirstName || ' ' || e.LastName,
        CASE 
            WHEN e.CreatedDate > CURRENT_TIMESTAMP - (p_days || ' days')::INTERVAL THEN 'Created'
            ELSE 'Modified'
        END,
        GREATEST(e.CreatedDate, e.ModifiedDate)
    FROM test.ITEmployees e
    JOIN test.ITEmployeeCompanies ec ON e.ITEmployeeID = ec.ITEmployeeID
    WHERE ec.CompanyID = p_company_id
    AND GREATEST(e.CreatedDate, e.ModifiedDate) > CURRENT_TIMESTAMP - (p_days || ' days')::INTERVAL
    
    UNION ALL
    
    -- New Hire changes
    SELECT 
        'New Hire'::TEXT,
        NewHireID,
        FirstName || ' ' || LastName,
        CASE 
            WHEN CreatedDate > CURRENT_TIMESTAMP - (p_days || ' days')::INTERVAL THEN 'Created'
            ELSE 'Modified'
        END,
        GREATEST(CreatedDate, ModifiedDate)
    FROM test.NewHires
    WHERE CompanyID = p_company_id
    AND GREATEST(CreatedDate, ModifiedDate) > CURRENT_TIMESTAMP - (p_days || ' days')::INTERVAL
    
    UNION ALL
    
    -- Task changes
    SELECT 
        'Setup Task'::TEXT,
        t.ITSetupTaskID,
        st.SetupName || ' for ' || nh.FirstName || ' ' || nh.LastName,
        CASE 
            WHEN t.CreatedDate > CURRENT_TIMESTAMP - (p_days || ' days')::INTERVAL THEN 'Created'
            WHEN t.IsCompleted THEN 'Completed'
            ELSE 'Modified'
        END,
        GREATEST(t.CreatedDate, t.ModifiedDate)
    FROM test.ITSetupTasks t
    JOIN test.NewHires nh ON t.NewHireID = nh.NewHireID
    JOIN test.SetupTypes st ON t.SetupTypeID = st.SetupTypeID
    WHERE nh.CompanyID = p_company_id
    AND GREATEST(t.CreatedDate, t.ModifiedDate) > CURRENT_TIMESTAMP - (p_days || ' days')::INTERVAL
    
    ORDER BY modified_date DESC;
END;
$$ LANGUAGE plpgsql;


-- Function to get all setup tasks for a specific new hire
CREATE OR REPLACE FUNCTION test.get_setup_tasks_by_newhire(
    p_new_hire_id INTEGER
)
RETURNS TABLE (
    taskid INTEGER,
    setuptype VARCHAR(100),
    setuptypeid INTEGER,
    itemployeeid INTEGER,
    itemployeename TEXT,
    companyid INTEGER,
    companyname VARCHAR(100),
    scheduleddate DATE,
    iscompleted BOOLEAN,
    completeddate TIMESTAMP,
    notes VARCHAR(500),
    details VARCHAR(1000),
    createddate TIMESTAMP,
    modifieddate TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.ITSetupTaskID,
        st.SetupName,
        st.SetupTypeID,
        e.ITEmployeeID,
        e.FirstName || ' ' || e.LastName,
        c.CompanyID,
        c.CompanyName,
        t.ScheduledDate,
        t.IsCompleted,
        t.CompletedDate,
        t.Notes,
        t.Details,
        t.CreatedDate,
        t.ModifiedDate
    FROM test.ITSetupTasks t
    JOIN test.SetupTypes st ON t.SetupTypeID = st.SetupTypeID
    JOIN test.ITEmployees e ON t.ITEmployeeID = e.ITEmployeeID
    JOIN test.NewHires nh ON t.NewHireID = nh.NewHireID
    JOIN test.Companies c ON nh.CompanyID = c.CompanyID
    WHERE t.NewHireID = p_new_hire_id
    ORDER BY t.ScheduledDate DESC, t.CreatedDate DESC;
END;
$$ LANGUAGE plpgsql;



-- Function to get all setup tasks for a specific IT employee
CREATE OR REPLACE FUNCTION test.get_setup_tasks_by_employee(
    p_it_employee_id INTEGER
)
RETURNS TABLE (
    taskid INTEGER,
    setuptype VARCHAR(100),
    setuptypeid INTEGER,
    companyid INTEGER,
    companyname VARCHAR(100),
    newhireid INTEGER,
    newhirename TEXT,
    scheduleddate DATE,
    iscompleted BOOLEAN,
    completeddate TIMESTAMP,
    notes VARCHAR(500),
    details VARCHAR(1000),
    createddate TIMESTAMP,
    modifieddate TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.ITSetupTaskID,
        st.SetupName,
        st.SetupTypeID,
        c.CompanyID,
        c.CompanyName,
        nh.NewHireID,
        nh.FirstName || ' ' || nh.LastName,
        t.ScheduledDate,
        t.IsCompleted,
        t.CompletedDate,
        t.Notes,
        t.Details,
        t.CreatedDate,
        t.ModifiedDate
    FROM test.ITSetupTasks t
    JOIN test.SetupTypes st ON t.SetupTypeID = st.SetupTypeID
    JOIN test.NewHires nh ON t.NewHireID = nh.NewHireID
    JOIN test.Companies c ON nh.CompanyID = c.CompanyID
    WHERE t.ITEmployeeID = p_it_employee_id
    ORDER BY t.ScheduledDate DESC, t.CreatedDate DESC;
END;
$$ LANGUAGE plpgsql;


-- Function to get all setup tasks for a specific company
CREATE OR REPLACE FUNCTION test.get_setup_tasks_by_company(
    p_company_id INTEGER
)
RETURNS TABLE (
    taskid INTEGER,
    setuptype VARCHAR(100),
    setuptypeid INTEGER,
    itemployeeid INTEGER,
    itemployeename TEXT,
    newhireid INTEGER,
    newhirename TEXT,
    scheduleddate DATE,
    iscompleted BOOLEAN,
    completeddate TIMESTAMP,
    notes VARCHAR(500),
    details VARCHAR(1000),
    createddate TIMESTAMP,
    modifieddate TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.ITSetupTaskID,
        st.SetupName,
        st.SetupTypeID,
        e.ITEmployeeID,
        e.FirstName || ' ' || e.LastName,
        nh.NewHireID,
        nh.FirstName || ' ' || nh.LastName,
        t.ScheduledDate,
        t.IsCompleted,
        t.CompletedDate,
        t.Notes,
        t.Details,
        t.CreatedDate,
        t.ModifiedDate
    FROM test.ITSetupTasks t
    JOIN test.SetupTypes st ON t.SetupTypeID = st.SetupTypeID
    JOIN test.ITEmployees e ON t.ITEmployeeID = e.ITEmployeeID
    JOIN test.NewHires nh ON t.NewHireID = nh.NewHireID
    WHERE nh.CompanyID = p_company_id
    ORDER BY t.ScheduledDate DESC, t.CreatedDate DESC;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION test.get_new_hires_by_company(p_company_id INTEGER)
RETURNS TABLE (
    newhireid INTEGER,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    email VARCHAR(100),
    companyid INTEGER,
    companyname VARCHAR(100),
    startdate DATE,
    createddate TIMESTAMP,
    modifieddate TIMESTAMP,
    isactive bool
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        nh.NewHireID,
        nh.FirstName,
        nh.LastName,
        nh.Email,
        nh.CompanyID,
        c.CompanyName,
        nh.HireDate,
        nh.CreatedDate,
        nh.ModifiedDate,
        nh.IsActive
    FROM test.NewHires nh
    JOIN test.Companies c ON nh.CompanyID = c.CompanyID
    WHERE nh.CompanyID = p_company_id
    ORDER BY nh.HireDate DESC, nh.LastName, nh.FirstName;
END;
$$ LANGUAGE plpgsql;




