const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()

router.get('/', function(req, res){
	// res.render('auth', {text: 'This is the dynamic data. Open index.js from the routes directory to see.'})
    res.json(
    	// confirmation: 'success'
    	"Hello from the auth route"
    )
})

router.post('/register', function(req, res){
	
	turbo.createUser(req.body)
	.then(data => {
		req.vertexSession.user = {id: data.id} 
		res.redirect('/dashboard')
		// res.json({
		// 	confirmation: 'success',
		// 	data: data
		// })
	})
	.catch(err => {
		res.json({
			confirmation: 'fail',
			message: err.message
		})
	})
})

router.post('/login',function(req, res){
    turbo.login(req.body)
    .then(data => {
    	req.vertexSession.user = {id: data.id} // set session with user ID
    	// res.json({
    	// 	confirmation: 'success',
    	// 	data: data
    	// })
    	res.redirect('/dashboard')
    })
    .catch(err => {
    	res.json({
    		confirmation: 'fail',
	    	message: err.message
    	})
	    	
    })
})

router.post('/update', function(req, res){
    if (!req.vertexSession) res.redirect('/')
    if (!req.vertexSession.user) res.redirect('/')

    turbo.updateUser(req.vertexSession.user.id, req.body)
    .then(data => {
    	res.json({
    		confirmation: 'success',
    		data: data
    	})
    })
    .catch(err => {
    	res.json({
    		confirmation: 'failure',
    		message: err.message
    	})
    })
})

module.exports = router