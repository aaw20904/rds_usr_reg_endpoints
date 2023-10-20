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
        let queryResult = await connection.query("SELECT region as valuex FROM regions;");
        let dataToSending = [];
        for(const item of queryResult[0]){
            dataToSending.push(item.valuex);
        }
        connection.release();
        return dataToSending;
    }

    async readDistrictsByRegion(region){
        let connection = await this.#bdPool.getConnection();
         let queryResult = await connection.query("SELECT  districts.district AS valuex "+
            " FROM regions INNER JOIN region_district ON regions.region_id = region_district.region_id "+
            " INNER JOIN districts ON region_district.district_id = districts.district_id "+
            `WHERE regions.region = "${region}";`);
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
