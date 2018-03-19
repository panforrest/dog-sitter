// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()

/*  This is the home route. It renders the index.mustache page from the views directory.
	Data is rendered using the Mustache templating engine. For more
	information, view here: https://mustache.github.io/#demo */
router.get('/', function(req, res){
	res.render('index', {text: 'This is the dynamic data. Open index.js from the routes directory to see.'})
})

router.get('/dashboard', function(req, res){
    if (!req.vertexSession) res.redirect('/')
    if (!req.vertexSession.user) res.redirect('/')

    turbo.fetchUser(req.vertexSession.user.id)
    .then(user => {
        if (user.type === 'Dog Owner') return [user, turbo.fetch('reservations', { owner: user.id })]
        else return[user, turbo.fetch('reservations', { sitter: user.id })]
    	// res.render('dashboard', { user: data })
        // return [user, turbo.fetch('reservations', { owner: user.id })]
    })
    .spread((user, reservations) => {
        if (user.type === 'Dog Owner') res.render('dashboard', { user: user, reservations: reservations, isDogOwner: true})
        else res.render('dashboard', { user: user, reservations: reservations, isDogSitter: true })
    })
    .catch(err => {
    	res.json({
    		confirmation: 'fail',
    		message: err.message
    	})
    })
})

router.get('/reservations', function(req, res){
    if (!req.vertexSession) res.redirect('/')
    if (!req.vertexSession.user) res.redirect('/')

    turbo.fetchUser(req.vertexSession.user.id)
    .then(user => {
        // if (user.type === 'Dog Owner') return [user, turbo.fetch('reservations', { owner: user.id })]
        // else return[user, turbo.fetch('reservations', { sitter: user.id })]

        // res.render('dashboard', { user: data })
        return [user, turbo.fetch('reservations', {})]
    })
    .spread((user, reservations) => {
        if (user.type === 'Dog Owner') res.render('reservations', { user: user, reservations: reservations, isDogOwner: true})
        else res.render('reservations', { user: user, reservations: reservations, isDogSitter: true })
    })
    .catch(err => {
        res.json({
            confirmation: 'fail',
            message: err.message
        })
    })
})

router.get('/profile/:id', function(req, res){

    turbo.fetchUser(req.params.id)
    .then(user => {
        return [user, turbo.fetch('reservations', {sitter: user})]
    })    
    .spread((user, reservations) => {
        res.render('reservations', { user: user, reservations: reservations})
    })    
        // turbo.fetch(reservations, {sitter: req.params.id})
        // .then(data => {
        //     res.render('profile', {user: user; data: data})    
        // })
        // .catch(err => {
        //     res.json({
        //         confirmation: 'fail',
        //         message: err.message
        //     })
        // })
        // res.render('profile', {user: user})
    .catch(err => {
        res.json({
            confirmation: 'fail',
            message: err.message
        })
    })



    // res.render('profile', {profile: req.params.id})
})

/*  This route render json data */
// router.get('/json', function(req, res){
// 	res.json({
// 		confirmation: 'success',
// 		app: process.env.TURBO_APP_ID,
// 		data: 'this is a sample json route.'
// 	})
// })

/*  This route sends text back as plain text. */
// router.get('/send', function(req, res){
// 	res.send('This is the Send Route')
// })

/*  This route redirects requests to Turbo360. */
// router.get('/redirect', function(req, res){
// 	res.redirect('https://www.turbo360.co/landing')
// })


module.exports = router
