const { Router } = require('express')
const jwt = require('jsonwebtoken')
const { con, query } = require('../config/connection')
const router = Router()

router.post('/api/agenda', async (req, res) => {
	const { id } = req.params	
    
    const { nom_consultorio	} = req.body

	try {

		//
		const {} = await query(
			`INSERT INTO consultorio (nombre) VALUES (?)`,
			[nom_consultorio]
		)
		}catch (error) {
			console.log(error)
			res.status(500).json({ msg: 'error en el servidor' })
		}
	})

    module.exports = router