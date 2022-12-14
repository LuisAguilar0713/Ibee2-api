const { Router } = require('express')
const jwt = require('jsonwebtoken')
const { con, query } = require('../config/connection')
const router = Router()

router.get('/api/pacientes/:termino', (req, res) => {
	const { termino } = req.params

	console.log(req.params)

	con.query(
		`select PA.*, PE.*, FT.* 
    from paciente PA, persona PE, foto FT 
    where PA.persona_id_persona=PE.id_persona 
    and PE.foto_id_foto=FT.id_foto 
    and PA.estatus='a'
    and CONCAT( PE.nombre,' ',PE.ap_paterno,' ',PE.ap_materno) LIKE '%${termino}%'  limit 50`,
		function (error, results, fields) {
			if (error) {
				return res.status(500).json({ error })
			}
			res.json({
				results,
			})
		}
	)
})

router.get('/api/ordenes', (req, res) => {

	console.log(req.params)

	con.query(
		`select OT., IU.
    from orden_trabajo OT, indicador_unidades_orden IU
    where OT.indicador_unidades_id=IU.id_unidades`,
		function (error, results, fields) {
			if (error) {
				return res.status(500).json({ error })
			}
			res.json({
				results,
			})
		}
	)
})

router.post('/api/registrar', async (req, res) => {
	const { id } = req.params

	const {
		nombre,
		ap_paterno,
		ap_materno,
		correo,
		password,
	} = req.body

	try {

		const { insertId: correoId } = await query(
			`INSERT INTO correo (correo) VALUES (?)`,
			[correo]
		)

		const { insertId: personaId } = await query(
			`INSERT INTO persona (id_correo,nombre, ap_paterno, ap_materno) VALUES (?,?,?,?)`,
			[correoId, nombre, ap_paterno, ap_materno]
		)

		const {}= await query(
			`INSERT INTO usuario (persona_id_persona,usuario,password) VALUES (?,?,?)`,
			[personaId,correo,password]
		)

		res.json({ msg: 'creado correctamente' })
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'error en el servidor' })
	}
})

router.get('/api/paciente/:id', async (req, res) => {
	const { id } = req.params
	try {
		const [df] = await query(`SELECT PA.*, PE.*, FT.* , D.*, DF.*, C.*
        FROM paciente PA, persona PE, foto FT ,direccion D, datos_fiscales DF, correo C
        WHERE PA.id_paciente='${id}'
        AND PA.persona_id_persona=PE.id_persona 
        AND PE.foto_id_foto=FT.id_foto 
		AND DF.direccion_id_direccion=D.id_direccion
		AND DF.correo_id_correo=C.id_correo
		AND PE.datos_fiscales_id_datos_fiscales=DF.id_datos_fiscales;`)

		const [paciente] = await query(`SELECT PA.*, PE.*, FT.* , D.*, DF.*
        FROM paciente PA, persona PE, foto FT ,direccion D, datos_fiscales DF
        WHERE PA.id_paciente='${id}'
        AND PA.persona_id_persona=PE.id_persona 
        AND PE.foto_id_foto=FT.id_foto 
        AND PE.direccion_id_direccion=D.id_direccion;`)

		const [telefono] = await query(`SELECT * 
        FROM paciente_has_telefono PHT, telefono T, tipo_telefono TT
        WHERE PHT.paciente_id_paciente = '${id}'
        AND PHT.telefono_id_telefono=T.id_telefono 
        AND T.tipo_telefono_id_tipo_telefono=TT.id_tipo_telefono 
        AND TT.id_tipo_telefono=1 `)

		const [tutor] = await query(`select P.* , T.* 
        from persona P, tutor T
        where T.paciente_id_paciente='${id}' 
        and T.persona_id_persona=P.id_persona`)

		paciente.telefono = telefono
		paciente.tutor = tutor
		paciente.df = df
		res.json({ paciente, df })
	} catch (error) {
		console.log(error)
	}
})
router.get('/api/cita', async (req, res) => {
	const { id } = req.params
	try {
		
		const [totalCitas] = await query(`SELECT CT.*
        FROM citas CT
        WHERE PA.id_paciente='${id}'
        AND PA.persona_id_persona=PE.id_persona 
        AND PE.foto_id_foto=FT.id_foto 
        AND PE.direccion_id_direccion=D.id_direccion;`)


		cita.totalCitas=tCitas
		res.json({ tCitas })
	} catch (error) {
		console.log(error)
	}
})

router.post('/api/productos', async (req, res) => {
	const { id } = req.params

	const {
		producto,
		descripcion,
		precio,
		cantidad,
		proveedor
	} = req.body

	try {
		const { } = await query(
			`INSERT INTO productos (producto, descripcion,precio, cantidad, proveedor) VALUES (?,?,?,?,?)`,
			[producto, descripcion, precio, cantidad, proveedor]
		)

		res.json({ msg: 'creado correctamente'})
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'error en el servidor' })
	}
})

router.post('/api/orden', async (req, res) => {
	const { id } = req.params

	const {
		u11,u12,u13,u14,u15,u16,u17,
		u21,u22,u23,u24,u25,u26,u27, 
		u31,u32,u33,u34,u35,u36,u37, 
		u41,u42,u43,u44,u45,u46,u47,
		doctor,
		fecha,
		paciente,
		edad,
		tipo_trabajo,
		vita,
		chromascop,
		otros,
		mamelones,
		translucidez,
		textura,
		brillo,
		yeso,
		oclusal,
		antagonista,
		foto,
		articulador,
		coronas,
		implante,
		cucharillas,
		notas
	} = req.body

	try {
		const { insertId: id_unidades} = await query(
			
			`INSERT INTO indicador_unidades_orden (u11, u12, u13, u14, u15, u16, u17, u21, u22, u23, u24, u25, u26, u27, u31, u32, u33, u34, u35, u36, u37, u41, u42, u43, u44, u45, u46, u47) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
			[ u11, u12, u13, u14, u15, u16, u17, u21, u22, u23, u24, u25, u26, u27, u31, u32, u33, u34, u35, u36, u37, u41, u42, u43, u44, u45, u46, u47]
		)

		const { } = await query(
		`INSERT INTO orden_trabajo (indicador_unidades_id, doctor, fecha,paciente, edad, tipo_trabajo,vita, chromascop,otros, mamelones, translucidez, textura, brillo, yeso,oclusal,antagonista,foto,articulador, coronas,implante,cucharillas,notas) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
			[id_unidades, doctor, fecha, paciente, edad, tipo_trabajo, vita, chromascop,otros, mamelones, translucidez, textura, brillo,yeso,oclusal,antagonista,foto,articulador,coronas,implante,cucharillas,notas]
		)

		res.json({ msg: 'creado correctamente'})
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'error en el servidor' })
	}
})

router.post('/api/tratamiento/:id', async (req, res) => {
	const { id } = req.params

	const {
		
		fecha,
		descripcion,
		nombre_doctor,
	} = req.body
	try {
		const {} = await query(
			
			`INSERT INTO tratamiento (id_paciente,fecha,descripcion,nombre_doctor) VALUES (?,?,?,?)`,
			[id,fecha,descripcion,nombre_doctor]
		)
		res.json({ msg: 'creado correctamente'})
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'error en el servidor' })
	}
})
router.post('/api/estudio', async (req, res) => {
	const { id } = req.params

	const {
		fecha,
		tipo_estudio,
		
	} = req.body
	try {
		const {} = await query(
			
			`INSERT INTO estudios (fecha,tipo_estudio) VALUES (?,?)`,
			[ fecha,tipo_estudio]
		)
		res.json({ msg: 'creado correctamente'})
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'error en el servidor' })
	}
})
router.post('/api/paciente', async (req, res) => {
	const { id } = req.params

	const {
		nombre,
		ap_paterno,
		ap_materno,
		telefono,
		whatsapp,
        edad,
		rfc,
		estado,
		ciudad,
		colonia,
		calle,
		numero,
		cp,
		regimen_fiscal,
		nif,
		razon_social,
		correo,
		estado2,
		ciudad2,
		colonia2,
		calle2,
		numero2,
		cp2,

	} = req.body

	try {

		// crea el registro de la direccion y obtiene el id
		const { insertId: direccionId } = await query(
			`INSERT INTO direccion (estado, ciudad,colonia, calle, numero, cp) VALUES (?,?,?,?,?,?)`,
			[estado, ciudad, colonia, calle, numero, cp]
		)

		const { insertId: direccion2Id } = await query(
			`INSERT INTO direccion (estado, ciudad,colonia, calle, numero, cp) VALUES (?,?,?,?,?,?)`,
			[estado2, ciudad2, colonia2, calle2, numero2, cp2]
		)

		const {insertId:correoID}= await query(
			`INSERT INTO correo (correo) VALUES (?)`,
			[correo]
		)

		//
		const { insertId: datos_fiscalesID } = await query(
			`INSERT INTO datos_fiscales (direccion_id_direccion, correo_id_correo, regimen_fiscal, nif, razon_social) VALUES (?,?,?,?,?)`,
			[direccion2Id, correoID, regimen_fiscal, nif, razon_social]
		)

		//

		// crea el registro de la persona y obtiene el id
		const { insertId: personaId } = await query(
			`INSERT INTO persona (nombre, ap_paterno, ap_materno,edad, rfc, direccion_id_direccion, foto_id_foto,datos_fiscales_id_datos_fiscales) VALUES (?,?,?,?,?,?,?,?)`,
			[nombre, ap_paterno, ap_materno, edad, rfc, direccionId, 1, datos_fiscalesID]
		)
		// crea el registro de paciente
		const { insertId: pacienteId } = await query(
			`INSERT INTO paciente (persona_id_persona,estatus) VALUES (?,?)`,
			[personaId, 'a']
		)
		// crea el registro de telefono
		const { insertId: telefonoId } = await query(
			`INSERT INTO telefono (tipo_telefono_id_tipo_telefono, telefono, whatsapp) VALUES (?,?,?)`,
			[1, telefono,whatsapp]
		)
		// crea el registro de paciente has telefono
		const { insertId: telefonoHasTelefonoId } = await query(
			`INSERT INTO paciente_has_telefono (paciente_id_paciente, telefono_id_telefono) VALUES (?,?)`,
			[pacienteId, telefonoId]
		)

        // obtiene el paciente que acabamos de crear
        const [paciente] = await query(`SELECT PA.*, PE.*, FT.* , D.*
        FROM paciente PA, persona PE, foto FT ,direccion D
        WHERE PA.id_paciente='${pacienteId}'
        AND PA.persona_id_persona=PE.id_persona 
        AND PE.foto_id_foto=FT.id_foto 
        AND PE.direccion_id_direccion=D.id_direccion;`)

		const [telefonoCreado] = await query(`SELECT * 
        FROM paciente_has_telefono PHT, telefono T, tipo_telefono TT
        WHERE PHT.paciente_id_paciente = '${pacienteId}'
        AND PHT.telefono_id_telefono=T.id_telefono 
        AND T.tipo_telefono_id_tipo_telefono=TT.id_tipo_telefono 
        AND TT.id_tipo_telefono=1`)

		const [tutor] = await query(`select P.* , T.* 
        from persona P, tutor T
        where T.paciente_id_paciente='${pacienteId}' 
        and T.persona_id_persona=P.id_persona`)

		paciente.telefono = telefonoCreado
		paciente.tutor = tutor

		res.json({ msg: 'creado correctamente', paciente })
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'error en el servidor' })
	}
})

//

//
router.put('/api/paciente/:id', async (req, res) => {
	const { id } = req.params

	const {
		foto,
		nombre,
		ap_paterno,
		ap_materno,
		telefono,
		whatsapp,
        edad,
		rfc,
		estado,
		ciudad,
		colonia,
		calle,
		numero,
		cp,
		regimen_fiscal,
		nif,
		razon_social,
		correo,
		estado2,
		ciudad2,
		colonia2,
		calle2,
		numero2,
		cp2,

	} = req.body

	try {

		const [df] = await query(`SELECT PA.*, PE.*, FT.* , D.*, DF.*, C.*
        FROM paciente PA, persona PE, foto FT ,direccion D, datos_fiscales DF, correo C
        WHERE PA.id_paciente='${id}'
        AND PA.persona_id_persona=PE.id_persona 
        AND PE.foto_id_foto=FT.id_foto 
		AND DF.direccion_id_direccion=D.id_direccion
		AND DF.correo_id_correo=C.id_correo
		AND PE.datos_fiscales_id_datos_fiscales=DF.id_datos_fiscales;`)

		const [paciente] = await query(`SELECT PA., PE., FT.* , D., DF.
        FROM paciente PA, persona PE, foto FT ,direccion D, datos_fiscales DF
        WHERE PA.id_paciente='${id}'
        AND PA.persona_id_persona=PE.id_persona 
        AND PE.foto_id_foto=FT.id_foto 
        AND PE.direccion_id_direccion=D.id_direccion;`)

		if (!paciente) {
			return res.status(400).json({ msg: 'el paciente no existe' })
		}
/*
		await query(`UPDATE correo SET
            correo='${correo}',
            WHERE id_correo='${df.correo_id_correo}';`)
*/
		await query(`UPDATE persona SET
            nombre='${nombre}',
            ap_paterno='${ap_paterno}',
            ap_materno='${ap_materno}',
			edad='${edad}',
            rfc='${rfc}'
            WHERE id_persona='${paciente.persona_id_persona}';`)
		await query(`UPDATE direccion SET
            estado='${estado}',
            ciudad='${ciudad}',
            colonia='${colonia}',
            calle='${calle}',
            numero='${numero}',
            cp='${cp}'
            WHERE id_direccion='${paciente.id_direccion}';`)

			const[dfDireccion] = await query(`SELECT * 
            FROM paciente PA, persona PE, direccion D, datos_fiscales DF
            WHERE PA.id_paciente = '${id}'
            AND PA.persona_id_persona= PE.id_persona
            AND PE.datos_fiscales_id_datos_fiscales= DF.id_datos_fiscales 
            AND DF.direccion_id_direccion= D.id_direccion`)

			if(dfDireccion){
				await query (`UPDATE direccion SET
            estado='${estado2}',
           	ciudad='${ciudad2}',
            colonia='${colonia2}',
			calle='${calle2}',
            numero='${numero2}',
            cp='${cp2}'
                WHERE id_direccion='${dfDireccion.id_direccion}';`)
			}

			/*const[dfInfo] = await query(`SELECT * 
            FROM paciente PA, persona PE, datos_fiscales DF
            WHERE PA.id_paciente = '${id}'
            AND PA.persona_id_persona= PE.id_persona
            AND PE.datos_fiscales_id_datos_fiscales= DF.id_datos_fiscales`)

			if(dfInfo){
			await query(`UPDATE datos_fiscales SET
            regimen_fiscal='${regimen_fiscal}',
            nif='${nif}',
            razon_social='${razon_social}',
            WHERE id_datos_fiscales='${dfInfo.datos_fiscales_id_datos_fiscales}';`)
			}*/

		const [telefonoPaciente] = await query(`SELECT * 
            FROM paciente_has_telefono PHT, telefono T, tipo_telefono TT
            WHERE PHT.paciente_id_paciente = '${id}'
            AND PHT.telefono_id_telefono=T.id_telefono 
            AND T.tipo_telefono_id_tipo_telefono=TT.id_tipo_telefono 
            AND TT.id_tipo_telefono=1`)

		if (telefonoPaciente) {
			await query(`UPDATE telefono SET
                telefono='${telefono}',
				whatsapp='${whatsapp}'
                WHERE id_telefono='${telefonoPaciente.id_telefono}';`)
		}

		res.json({ msg: 'actulizado correctamente' })
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'error en el servidor' })
	}
})

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

router.get('/api/pacienteParaPago/:id', async (req, res) => {
	const { id } = req.params
	try {
		const [paciente] = await query(`SELECT PA.*, PE.*, FT.* , D.*
        FROM paciente PA, persona PE, foto FT ,direccion D
        WHERE PA.id_paciente='${id}'
        AND PA.persona_id_persona=PE.id_persona 
        AND PE.foto_id_foto=FT.id_foto 
        AND PE.direccion_id_direccion=D.id_direccion;`)

		const [telefono] = await query(`SELECT * 
        FROM paciente_has_telefono PHT, telefono T, tipo_telefono TT
        WHERE PHT.paciente_id_paciente = '${id}'
        AND PHT.telefono_id_telefono=T.id_telefono 
        AND T.tipo_telefono_id_tipo_telefono=TT.id_tipo_telefono 
        AND TT.id_tipo_telefono=2`)

		const [tutor] = await query(`select P.* , T.* 
        from persona P, tutor T
        where T.paciente_id_paciente='${id}' 
        and T.persona_id_persona=P.id_persona`)

		res.json({ paciente, telefono, tutor })
	} catch (error) {
		console.log(error)
	}
})

module.exports = router