const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try{
     const {rows: [routine_activity]} = await client.query(`

      INSERT INTO routine_activities("routineId", "activityId", count, duration)
      VALUES($1, $2, $3, $4)
      ON CONFLICT("routineId", "activityId") DO Nothing
      RETURNING *;
     `,[routineId, activityId, count, duration]);

    //  console.log(results)
    return routine_activity;
  }catch(error){
    console.error('ERROR Adding Activities to Routines !!!',error);
    throw error;
  }
};

async function getRoutineActivityById(id) {
  try {
    const { rows: [routine_activity] } = await client.query(`

      SELECT *
      FROM routine_activities
      WHERE id = $1;
      `,[id]);

    return routine_activity;
  } catch (error) {
    console.error('ERROR Getting Routine Activity by Id!!!', error);
    throw error;
  }
};


async function getRoutineActivitiesByRoutine({ id }) {
  try{
    const { rows } = await client.query(`
     
    SELECT *
    FROM routine_activities
    WHERE id = $1;
    `, [id]);

   // console.log(result)
   return rows;
  }catch(error){
    console.error('ERROR Getting Routine Activities by Routine!!!',error);
  }
};

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
).join(',');

  try {
    if (setString.length > 0) {
   const { rows: [ routine_activity ] } = await client.query(`
  UPDATE routine_activities
  SET ${setString}
  WHERE id=${id}
  RETURNING *;
`, Object.values(fields)); 

  return routine_activity;
  }
   
  } catch (error) {
      throw error;
  }
};

async function destroyRoutineActivity(id) {
  try {
		const { rows: [routine_activity] } = await client.query(`

      DELETE FROM routine_activities
      WHERE id = $1
      RETURNING *;
      `,[id]);

//console.log(result)
		return routine_activity;
	} catch (error) {
		console.error("ERROR Destroying Routine Activity!!!", error);
		throw error;
	}
};

async function canEditRoutineActivity(routineActivityId, userId) {
  try{
    
    const {rows: [routine_activity] } = await client.query(`
    SELECT routine_activities.*, routines.*  
    FROM routine_activities
    JOIN routines ON routine_activities."routineId"=routines.id
    WHERE routine_activities.id=$1;
    `, [routineActivityId])
    
    if(routine_activity.creatorId === userId){
      return true
    }
    
  } catch(error){
    console.error("ERROR Editing Routine Activity!!!", error);
    throw error;
  }
};

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
