-- get all pending tasks for a specific it employee
create or replace function test.get_it_employee_pending_tasks(p_it_employee_id integer)
returns table (
    taskid integer,
    newhireid integer,
    newhirename text,
    setuptype varchar(100),
    scheduleddate date,
    companyname varchar(100),
    iscompleted bool
) as $$
begin
    return query
    select 
	    ist.itsetuptaskid,
	    nh.newhireid,
	    nh.firstname || ' ' || nh.lastname,
	    st.setupname,
	    ist.scheduleddate,
	    c.companyname,
		ist.iscompleted
	from test.itsetuptasks ist
	join test.newhires nh on ist.newhireid = nh.newhireid
	join test.setuptypes st on ist.setuptypeid = st.setuptypeid
	join test.companies c on nh.companyid = c.companyid
	where ist.itemployeeid = p_it_employee_id
	--and ist.iscompleted = false
	order by ist.scheduleddate;
end;
$$ language plpgsql;

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
create or replace function test.get_it_employee_workload()
returns table (
    itemployeeid integer,
    itemployeename text,
    pendingtasks bigint,
    completedtasks bigint,
    totaltasks bigint,
    companyname varchar(100)
) as $$
begin
    return query
    select 
		ite.itemployeeid,
        ite.firstname || ' ' || ite.lastname,
        count(case when ist.iscompleted = false then 1 end),
        count(case when ist.iscompleted = true then 1 end),
        count(*),
        c.companyname
    from test.itemployees ite
    left join test.itsetuptasks ist on ite.itemployeeid = ist.itemployeeid
    left join test.companies c on ite.companyid = c.companyid
    group by ite.itemployeeid, ite.firstname, ite.lastname, c.companyname
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
create or replace function test.get_overdue_tasks(p_it_employee_id integer)
returns table (
    itsetuptaskid integer,
    itemployeename text,
    newhirename text,
    setuptype varchar(100),
    scheduleddate date,
    daysoverdue integer,
    companyname varchar(100)
) as $$
begin
    return query
    select 
        ist.itsetuptaskid,
        ite.firstname || ' ' || ite.lastname,
        nh.firstname || ' ' || nh.lastname,
        st.setupname,
        ist.scheduleddate,
        (current_date - ist.scheduleddate)::integer,
        c.companyname
    from test.itsetuptasks ist
    join test.itemployees ite on ist.itemployeeid = ite.itemployeeid
    join test.newhires nh on ist.newhireid = nh.newhireid
    join test.setuptypes st on ist.setuptypeid = st.setuptypeid
    join test.companies c on nh.companyid = c.companyid
    where ist.iscompleted = false
    and ist.scheduleddate < current_date
	and ist.itemployeeid = p_it_employee_id
    order by daysoverdue desc;
end;
$$ language plpgsql;

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

-- example usage of the functions:
/*
select * from test.get_it_employee_pending_tasks(5);
select * from test.get_new_hire_setup_status(1);
select * from test.get_it_employee_workload();
select * from test.get_todays_tasks();
select * from test.get_company_onboarding_progress(1);
select * from test.get_overdue_tasks(4);
select * from test.update_task_completion(111, 5, 4, 'asdf')

select * from test.itsetuptasks where itsetuptaskid = 111

drop function test.get_new_hire_setup_status;
drop function test.get_it_employee_pending_tasks;
drop function test.get_it_employee_workload;
drop function test.get_todays_tasks;
drop function test.get_company_onboarding_progress;
drop function test.get_overdue_tasks;
*/