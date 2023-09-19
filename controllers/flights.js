import { Flight } from '../models/flight.js'

function index(req, res) {
  Flight.find({}).sort({departs: 1})
  .then (flights => {
    res.render('flights/index', {
      flights: flights,
      title: 'All Flights'
    })
  })
  .catch(error => {
    console.log(error)
    res.redirect('/flights')
  })
}

function newFlight(req, res){
  const newFlight = new Flight();
  const dt = newFlight.departs
  const departsDate = dt.toISOString().slice(0, 16)
  Flight.find({})
  .then(flights => {
    res.render('flights/new', {
      flights,
      departsDate: departsDate,
      title: 'Add Flight'
    })
  })
  .catch(error => {
    console.log(error)
    res.redirect('/flights')
  })
}

function create(req, res){
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key]
	}
  Flight.create(req.body)
  .then(flight => {
    console.log(flight)
    res.redirect('/flights')
  })
  .catch(error => {
    console.log(error)
    res.redirect('/flights')
  })
}

function show(req, res){
  Flight.findById(req.params.flightId)
  .then(flight => {
    res.render('flights/show', {
      title: 'Flight Details',
      flight: flight
    })
  })
  .catch(error => {
    console.log(error)
    res.redirect('/flights')
  })
}

function deleteFlight(req, res){
  Flight.findByIdAndDelete(req.params.flightId)
  .then(flight => {
    res.redirect('/flights')
  })
  .catch(error => {
    console.log(error)
    res.redirect('/flights')
  })
}

function edit(req, res){
  Flight.findById(req.params.flightId)
  .then (flight => {
    const departsDate = flight.departs.toISOString().substring(0, 10)
    res.render('flights/edit', {
      flight,
      departsDate: departsDate,
      title: 'Edit Flight'
    })
  })
  .catch(error => {
    console.log(error)
    res.redirect('/flights')
  })
}

function update(req, res){
  Flight.findByIdAndUpdate(req.params.flightId, req.body, {new: true})
  .then(flight => {
    res.redirect(`flights/${flight._id}`)
  })
  .catch(error => {
    console.log(error)
    res.redirect('/flights')
  })
}
function createTicket(req, res) {
  Flight.findById(req.params.flightId)
  .then(flight => {
    flight.tickets.push(req.body)
    flight.save()
    .then(() => {
      res.redirect(`/flights/${flight._id}`)
    })
    .catch(error => {
      console.log(error)
      res.redirect('/flights')
    })
  })
  .catch(error => {
    console.log(error)
    res.redirect('/flights')
  })
}

function deleteTicket(req, res) {
  console.log('Flight ID:', req.params.flightId)
  console.log('Ticket ID:', req.params.ticketId)
  Flight.findById(req.params.flightId)
  .then(flight => {
    const ticketIdx = flight.tickets.findIndex(ticket => ticket._id === req.params.ticketId)
    console.log('Ticket idx:', ticketIdx)
    if (ticketIdx !== -1) {
      flight.tickets.splice(ticketIdx, 1)
      flight.save()
      .then(() => {
        console.log('Ticket deleted successfully')
        res.redirect(`/flights/${flight._id}`)
      })
      .catch(error => {
        console.log('Error saving flight:', error)
        res.redirect('/flights')
      })
    } else {
      console.log('Ticket not found')
      res.redirect(`/flights/${flight._id}`)
    }
  })
  .catch(error => {
    console.log('Error finding flight:', error)
    res.redirect('/flights')
  })
}

export {
  index,
  newFlight as new,
  create,
  show,
  deleteFlight as delete,
  edit,
  update,
  createTicket,
  deleteTicket
}