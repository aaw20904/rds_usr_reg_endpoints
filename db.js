const mysql = require('mysql2'); //database mamnagement system MySQL---------------------------

const mysqlPromise = require('mysql2/promise');

class MysqlLayer {
    #bdPool;
      constructor(par={basename:"basename", password:"psw", user:"usr",host:"host"}){
          this.#bdPool = mysqlPromise.createPool({
            host: par.host,
            user: par.user,
            password: par.password,
            database: par.basename,
            connectionLimit: 10 // Specify the maximum number of connections in the pool
          });
    }

       /*
   
▄▀█ █▀▀ ▀█▀ █░█ ▄▀█ █░░   █▀▄▀█ █▀▀ ▀█▀ █░█ █▀█ █▀▄ █▀
█▀█ █▄▄ ░█░ █▄█ █▀█ █▄▄   █░▀░█ ██▄ ░█░ █▀█ █▄█ █▄▀ ▄█
    */

    getMysqlPool(){
        return this.#bdPool;
    }
   
    //****************not****OK! tested
    async closeDatabase(){
        return await this.#bdPool.end();
     }
    ///***********not****OK! tested!! */

    async readAllRegions(){
        let connection = await this.#bdPool.getConnection();
        let queryResult = await connection.query("SELECT region_id AS key_x, region as value_x FROM regions ORDER BY region;");
        let dataToSending = [];
        for(const item of queryResult[0]){
            let objRepresent = {};
            objRepresent.key_x = item.key_x;
            objRepresent.value_x = item.value_x;
            dataToSending.push(objRepresent);
        }
        connection.release();
        return dataToSending;
    }

    async readDistrictsByRegion(region){
        let connection = await this.#bdPool.getConnection();
         let queryResult = await connection.query(" SELECT districts.district_id AS key_x, districts.district AS value_x FROM districts "+
            " INNER JOIN region_district ON region_district.district_id = districts.district_id  "+
         " INNER JOIN districts as districts2 ON region_district.district_id = districts2.district_id"+
            ` WHERE region_district.region_id="${region}";`);
        let dataToSending = [];
        for(const item of queryResult[0]){
           let objRepresent = {};
            objRepresent.key_x = item.key_x;
            objRepresent.value_x = item.value_x;
            dataToSending.push(objRepresent);
        }
          connection.release();
        return dataToSending;
    }

      async readLocalitiesByParams(region,district){
        let connection = await this.#bdPool.getConnection();
         let queryResult = await connection.query(' SELECT CONCAT_WS(" ", type_of_localities.descr, names_of_localities.locality) AS value_x, locations.locality_key AS key_x FROM names_of_localities  '+
            " INNER JOIN locations ON locations.locality_id=names_of_localities.locality_id "+
            " INNER JOIN  type_of_localities ON  type_of_localities.loc_type=locations.loc_type "+
            " INNER JOIN region_district ON  region_district.rdi=locations.rdi "+
            ` WHERE region_district.region_id=${region} AND region_district.district_id=${district};`);
        let dataToSending = [];
        for(const item of queryResult[0]){
            dataToSending.push(item.valuex);
        }
          connection.release();
        return dataToSending;
    }



   /*
   
█▀▀ █▀█ █▀▀   ▄▀█ █▀▀ ▀█▀ █░█ ▄▀█ █░░   █▀▄▀█ █▀▀ ▀█▀ █░█ █▀█ █▀▄ █▀
██▄ █▄█ █▀░   █▀█ █▄▄ ░█░ █▄█ █▀█ █▄▄   █░▀░█ ██▄ ░█░ █▀█ █▄█ █▄▀ ▄█
    */

    
    async getUserByEmail (email) {
        let connection = await this.#bdPool.getConnection();
        let result = await connection.query(
            `SELECT * FROM users INNER JOIN user_mail WHERE user_mail.email="${email}" AND users.user_id=user_mail.user_id;`
        );
        connection.release();
        return result[0][0];
    }
///OK!*******tested
    async incrementFailLogins (user_id) {
        let connection = await this.#bdPool.getConnection();
        let result = await connection.query(`UPDATE users SET fail_a=fail_a+1, fail_date=UNIX_TIMESTAMP()*1000 WHERE user_id=?;`,[ user_id]);
        connection.release();
        if(result.length >= 1){
            return result[0].affectedRows;
        }else {
            return false;
        }
    }

//OK!*****tested
    async  clearUserBlocking (user_id) {
        let connection = await this.#bdPool.getConnection();
        let result = await  connection.query(`UPDATE users SET fail_a=0 WHERE user_id=? ;`,[user_id]);
        connection.release();
        if(result.length >= 1){
            return result[0].affectedRows;
        }else {
            return false;
        }

    }


    ////transaction template
     async createNewUser (par={name:"",password:"", email:"example@mail.com", picture:"123", passw:0, salt:0, phone:"911"}) {
        let connection, generated_identifier;
         
            connection = await this.#bdPool.getConnection();
            await connection.beginTransaction();
            try{
             //firstly fill a user_mail table:
                generated_identifier = await  connection.query('INSERT INTO user_mail ( email) VALUES (?)', [par.email]);
                //get generated Id by system
                generated_identifier = generated_identifier[0].insertId;
                //write user info using gnerated by MySQL user_id:
                await connection.query('INSERT INTO users ( user_id, passw, picture, uname,  salt, phone) VALUES (?, ?, ?, ?, ?, ?)',
                                          [generated_identifier, par.password, par.picture, par.name, par.salt, par.phone]);
                //apply 
                await connection.commit();
                
            }catch(err){
                 let myErr = new Error(err);
               //has a user already exists?
                if(err.errno === 1062){
                    myErr.alrEx = true;
                } else{
                    myErr.alrEx =false;
                }
                
                await connection.rollback();
               
                
                throw myErr;
            }finally{
                connection.release();
            }
  
     }

   
     //OK!****************** tested
   

}



module.exports ={ MysqlLayer};
