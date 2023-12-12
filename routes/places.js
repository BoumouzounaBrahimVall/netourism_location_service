const router = require('express').Router();
const pool = require("../db");


//get all nairobi health facilities

router.get("/places", async(req, res)=>{
    try{
        const places = await pool.query("SELECT id, ST_AsGeojson(geom)::json as point FROM public.places");
        res.json(places.rows);

    }catch(err){
        console.error(err.message);
        res.status(500).send("server error");
    }
});
/**
 DELETE FROM public.places
	WHERE id>48;
 */
router.get('/place/:lat/:lon/:distance', async (req, res) => {
  const { lat, lon, distance } = req.params; // distance in meters
  const query = `
    SELECT id, ST_AsGeojson(geom)::json as point FROM public.places
    WHERE ST_DWithin(geom, ST_MakePoint(${lon}, ${lat}), ${distance})
  `;
  const results = await pool.query(query);
  res.json(results.rows);
});
router.post('/add', async (req, res) => {
  const lat = req.body.lat;
  const lon = req.body.lon;
  const loc = lon + ' ' + lat; // Reversed order: lon first, then lat

  const existingLocQuery=`SELECT id, ST_AsGeojson(geom)::json as point FROM public.places WHERE ST_DWithin(geom, ST_GeomFromText('POINT(${loc})', 4326), 1);`
  const results = await pool.query(existingLocQuery);
  // place already added 
  if(results.rowCount!=0){
    res.status(200).send({ message: 'place already added' }); 
    return;
  }
  // new place 
  const query = `INSERT INTO public.places(geom) VALUES (ST_GeomFromText('POINT(${loc})', 4326));`;

  try {
    await pool.query(query);

    // Assuming pool.query doesn't throw an error, execution reaches here
    res.status(200).send({ message: 'Place added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error adding place' });
  }
});

router.delete('/delete-place/:id', async (req, res) => {
  
  const { id } = req.params;

  try {
    const query = 'DELETE FROM public.places WHERE id = $1';
    const values = [id];

    const result = await pool.query(query, values);

    if (result.rowCount > 0) {
      res.status(200).json({ message: `Successfully deleted places with id greater than ${id}` });
    } else {
      res.status(404).json({ message: `No places found with id greater than ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting places' });
  }
});






/**
  
  SELECT id FROM places WHERE geom = ST_GeomFromText('POINT(33.7055048 -7.3540685)', 4326);

  SELECT id, ST_AsGeojson(geom)::json as point FROM places WHERE ST_DWithin(geom, ST_GeomFromText('POINT(-71.060316 48.432048)', 4326), 3)

*/


/*
// Get all places
app.get('/place/all', async (req, res) => {
  const query = 'SELECT * FROM places';
  const results = await client.query(query);
  res.send(results.rows);
});
SELECT * FROM places where ST_DistanceSphere(geom, :p) < :distanceM

 Get all places within a given distance of a given latitude and longitude




// Add a place
app.post('/place/add', async (req, res) => {
  const { geom } = req.body;
  const query = 'INSERT INTO places (geom) VALUES ($1)';
  const values = [geom];
  await client.query(query, values);
  res.send({ message: 'Place added successfully' });
});

// Delete a place
app.delete('/place/delete/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM places WHERE id = $1';
  const values = [id];
  await client.query(query, values);
  res.send({ message: 'Place deleted successfully' });
});





router.get("/api/nairobisubcounties" , async(req, res) =>{
    try{
        const nairobiSubcounties = await pool.query("SELECT id, ST_AsGeojson(geom)::json as polygon, name FROM public.nairobi_sub_counties");
        res.json(nairobiSubcounties.rows);

    }
    catch(err){
        console.error(err.message);
        res.status(500).send('server error' + err.message);
    }
});
*/

module.exports= router;