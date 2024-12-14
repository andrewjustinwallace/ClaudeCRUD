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