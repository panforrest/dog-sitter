// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()

/*  This is a sample API route. */

router.get('/:reservations', function(req, res){
    turbo.fetch('reservation', {})
    .then(data => {
    	res.json({
    		confirmation:'success',
	    	data: data
    	})
	    	
    })	
    .catch(err => {
    	res.json({
    		confirmation: 'failure',
    		data: err
    	})
    })
})

router.post('/reservations', function(req, res){
	if (!req.vertexSession) res.redirect('/')
    if (!req.vertexSession.user) res.redirect('/')

    turbo.create('reservations', req.body)
    .then(data => {
    	res.json({
    		confirmation: 'success',
    		data: data
    	})
    })
    .catch(err => {
    	res.json({
    		confirmation: 'failure',
    		data: err
    	})
    })
})


module.exports = router
