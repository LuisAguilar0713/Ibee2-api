const mysql      = require('mysql');
const util = require('util');

// clever cloud old
/*
const con = mysql.createConnection({
  host     : 'bklb0otatxag0a1qv5gj-mysql.services.clever-cloud.com',
  user     : 'ux182sgoiygo7lte',
  password : 'ZjxbAAAvCdvRz3fFUVEY',
  database : 'bklb0otatxag0a1qv5gj'
});
}); */

/*
// clever cloud new
const con = mysql.createConnection({
  host     : 'baeq4ipjypvzoxky1bbz-mysql.services.clever-cloud.com',
  user     : 'uoch1ell0gacxuot',
  password : 'SRl9jfbaWX98qsq0WyLE',
  database : 'baeq4ipjypvzoxky1bbz'
});
*/

// local

const con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '12345',
  database : 'ibee_actualizada_nueva_2'
});



module.exports ={
    con,
    query( sql, args ) {
      return util.promisify( con.query )
        .call( con, sql, args );
    },
}