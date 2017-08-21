module.exports = function() {

	app.get('/', function(req, res) {

		res.render('pages/home');
	});

	app.get('/api/appointment/:date', function(req, res) {
	  req.accepts('text/html');
	  //const { date } =  req.params.date;
	  const payload = exec(`DentrixAdapter.exe GetAppointments ${req.params.date}`, (error, stdout, stderr) => {
	    var output = stdout.split("\n")
	    console.log("DA OUTPUT" + output);
	    var appts = []
  //  foo.split(';')[0].split(':')[1]
    	for (var i = 0; i < output.length-4; i+=4) {
	      var patientGUID = output[i].split(':')[1];
	      var patientName = output[i+1].split(':')[1];
	      var appointmentDate = output[i+2].split(':')[1];
	      var providerID = output[i+3].split(':')[1];
	      appts.push({patientGUID: patientGUID, patientName: patientName, appointmentDate: appointmentDate, providerID: providerID})
	    }

        //res.send(JSON.stringify({ a: 1 }));
    	res.send(JSON.stringify({'payload':appts}));
  	});

	});

// route POST /api/note
	app.post('/api/note/', function(req, res) {
	  // const { PatientGUID, NoteText, ProviderID } = req.body
	  res.send(`via POST request body guid ${req.body}`)
	  const { text } = req.body;
	  const file = fs.writeFile("/tmp/post", text, function(err) {
	    if (err) {
	      return console.log(err);
	    }
	    console.log('file saved');
	    const payload = exec(`DentrixAdapter.exe PostNote ${req.patientGUID} ${file} ${req.providerID}`, (error, stdout, stderr) => {

	    })
	  })
	  console.log(req.body);
	});

}
