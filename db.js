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

    isRegionCapital(region){
         //checkng - are the localities  capital cities?
        if(region ==26 || region==27){
            return true;
        } else {
            return false;
        }
    }

    async readStreetsOfCapitalCities(region_id){
        let connection = await this.#bdPool.getConnection();
         let queryResult = await connection.query(' SELECT CONCAT_WS(".", street_type.descr, streets.street) AS value_x ,concat_ws("@", streets_in_localities.street_type, streets_in_localities.street_id) AS key_x , locations.locality_key AS locality FROM streets_in_localities '+
            " INNER JOIN street_type ON street_type.street_type=streets_in_localities.street_type  "+
            " INNER JOIN streets ON streets.street_id=streets_in_localities.street_id  "+
            " INNER JOIN locations ON streets_in_localities.locality_key=locations.locality_key  "+
            " INNER JOIN region_district ON locations.rdi=region_district.rdi "+
            `WHERE region_district.district_id=500 AND region_id=${region_id}`);
        let dataToSending = [];
        for(const item of queryResult[0]){
            let tmp={};
            tmp.value_x = item.value_x;
            tmp.key_x = item.key_x;
            tmp.locality = item.locality;
            dataToSending.push(tmp);
        }
          connection.release();
          //write locality key
          
        return dataToSending;
    }
//THE FUNCTION HAS NOT BEEN TESTED!
    async insertRealEstateInDB ( locality_id, street_type, street_id, house_num, flat, user_id) {

         let connection = await this.#bdPool.getConnection();
         try{
                let queryResult = await connection.query(' INSERT INTO real_estate (st_id, house, flat, user_id) VALUES ('+
                //inner request
                `(SELECT streets_in_localities.id FROM my_bot.locations `+
                ` INNER JOIN  my_bot.streets_in_localities ON streets_in_localities.locality_key=locations.locality_key `+
                ` INNER JOIN my_bot.street_type ON streets_in_localities.street_type=street_type.street_type `+
                ` INNER JOIN my_bot.streets ON streets_in_localities.street_id=streets.street_id `+
                `WHERE locations.locality_key=${locality_id} AND street_type.street_type=${street_type} AND streets.street_id=${street_id}) `+
                //end inner request
                `, ${house_num}, ${flat}, ${user_id} );`);
                return {success:true}
               connection.release();
        } catch(e) {
                connection.release();
                if(e.errno == 1062){
                    return {success:false, duplicate:true};
                }else{
                    return {success:false,  serverError:true};
                }
         }
          
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

      async readLocalitiesByParams (region,district) {
        let connection = await this.#bdPool.getConnection();
         let queryResult = await connection.query(' SELECT CONCAT_WS(" ", type_of_localities.descr, names_of_localities.locality) AS value_x, locations.locality_key AS key_x FROM names_of_localities  '+
            " INNER JOIN locations ON locations.locality_id=names_of_localities.locality_id "+
            " INNER JOIN  type_of_localities ON  type_of_localities.loc_type=locations.loc_type "+
            " INNER JOIN region_district ON  region_district.rdi=locations.rdi "+
            ` WHERE region_district.region_id=${region} AND region_district.district_id=${district};`);
        let dataToSending = [];
        for (const item of queryResult[0]) {
            let tmp={};
            tmp.value_x = item.value_x;
            tmp.key_x = item.key_x;
            dataToSending.push(tmp);
        }
          connection.release();
        return dataToSending;
    }

    //
    async readLocalityRegistrationDataByIDs (locality_key, street_type, street_id) {

    let connection = await this.#bdPool.getConnection();
         let queryResult = await connection.query('SELECT type_of_localities.descr AS loc_type, names_of_localities.locality, regions.region,   '+
            "   districts.district,  street_type.descr AS str_t, streets.street FROM locations  "+
            " INNER JOIN type_of_localities ON type_of_localities.loc_type = locations.loc_type   "+
            " INNER JOIN names_of_localities ON names_of_localities.locality_id=locations.locality_id   "+
            " INNER JOIN streets_in_localities ON streets_in_localities.locality_key = locations.locality_key "+
            " INNER JOIN streets ON streets.street_id = streets_in_localities.street_id  "+
            " INNER JOIN street_type ON street_type.street_type = streets_in_localities.street_type  "+
            " INNER JOIN region_district ON locations.rdi= region_district.rdi  "+
            " INNER JOIN districts ON region_district.district_id = districts.district_id "+
            " INNER JOIN regions ON  region_district.region_id = regions.region_id  "+
            `WHERE locations.locality_key=${locality_key} AND street_type.street_type=${street_type} AND streets.street_id=${street_id};`);
        let dataToSending = [];
        for(const item of queryResult[0]){
            let tmp={};
            tmp.street_type = item.str_t,
            tmp.district = item.district,
            tmp.street = item.street,
            tmp.locality = item.locality,
            tmp.locality_type = item.loc_type
            tmp.region = item.region;
            dataToSending.push(tmp);
        }
          connection.release();
        return dataToSending;
    }

   async getCapitalsRegistrationDataByIDs(region, street_id, street_type){
        let connection = await this.#bdPool.getConnection();
         let queryResult = await connection.query('SELECT type_of_localities.descr AS loc_type, names_of_localities.locality, regions.region,   '+
            "   '-' AS district,  street_type.descr AS str_t, streets.street FROM locations  "+
            " INNER JOIN type_of_localities ON type_of_localities.loc_type = locations.loc_type   "+
            " INNER JOIN names_of_localities ON names_of_localities.locality_id=locations.locality_id   "+
            " INNER JOIN streets_in_localities ON streets_in_localities.locality_key = locations.locality_key "+
            " INNER JOIN streets ON streets.street_id = streets_in_localities.street_id  "+
            " INNER JOIN street_type ON street_type.street_type = streets_in_localities.street_type  "+
            " INNER JOIN region_district ON locations.rdi= region_district.rdi  "+
            " INNER JOIN districts ON region_district.district_id = districts.district_id "+
            " INNER JOIN regions ON  region_district.region_id = regions.region_id  "+
            `WHERE regions.region_id=${region} AND districts.district_id=500 AND  street_type.street_type=${street_type} AND streets.street_id=${street_id};`);
        let dataToSending = [];
        for(const item of queryResult[0]){
            let tmp={};
            tmp.street_type = item.str_t,
            tmp.district = item.district,
            tmp.street = item.street,
            tmp.locality = item.locality,
            tmp.locality_type = item.loc_type
            tmp.region = item.region;
            dataToSending.push(tmp);
        }
          connection.release();
        return dataToSending;
    }


    //
     async  readStreetsByLocID (localityId) {
        let connection = await this.#bdPool.getConnection();
         let queryResult = await connection.query('SELECT CONCAT_WS(".", street_type.descr, streets.street) AS value_x ,concat_ws("@", streets_in_localities.street_type, streets_in_localities.street_id) AS key_x FROM streets_in_localities '+
            " INNER JOIN street_type ON street_type.street_type=streets_in_localities.street_type  "+
            " INNER JOIN streets ON streets.street_id=streets_in_localities.street_id  "+
            ` WHERE streets_in_localities.locality_key="${localityId}";`);
        let dataToSending = [];
        for(const item of queryResult[0]){
            let tmp={};
            tmp.value_x = item.value_x;
            tmp.key_x = item.key_x;
            dataToSending.push(tmp);
        }
          connection.release();
        return dataToSending;
    }

    /**********
    
    
█▀▀ █▀█ █░█ █▄░█ ▀█▀ █▀▀ █▀█   █▀█ █▀▀ █▀▀ █ █▀ ▀█▀ █▀█ ▄▀█ ▀█▀ █ █▀█ █▄░█
█▄▄ █▄█ █▄█ █░▀█ ░█░ ██▄ █▀▄   █▀▄ ██▄ █▄█ █ ▄█ ░█░ █▀▄ █▀█ ░█░ █ █▄█ █░▀█
     */

  /*
  the function returns an array of objects [{estate_id, descr }]
   */
    async readAddressesOfEstateByUser (user_id) {
let connection = await this.#bdPool.getConnection();
        let queryResult = await connection.query(" SELECT real_estate.st_id AS estate_id, CONCAT_WS(' ', regions.region, ',', districts.district, ',' , type_of_localities.descr, names_of_localities.locality, ',' , street_type.descr,  streets.street , real_estate.house, ',', 'flat:', real_estate.flat ) AS descr FROM locations "+ 
                        " INNER JOIN region_district ON locations.rdi=region_district.rdi "+
                        " INNER JOIN regions ON region_district.region_id=regions.region_id "+
                        " INNER JOIN districts ON region_district.district_id=districts.district_id "+
                        " INNER JOIN type_of_localities ON locations.loc_type=type_of_localities.loc_type "+
                        " INNER JOIN names_of_localities ON locations.locality_id=names_of_localities.locality_id "+
                        " INNER JOIN streets_in_localities ON locations.locality_key=streets_in_localities.locality_key "+
                        " INNER JOIN street_type ON streets_in_localities.street_type=street_type.street_type "+
                        " INNER JOIN streets ON streets_in_localities.street_id=streets.street_id "+
                        " INNER JOIN real_estate ON streets_in_localities.id=real_estate.st_id "+
                        ` WHERE real_estate.user_id=${user_id}; ` );
            connection.release();
            return queryResult[0];
        

}

async readCounterTypes(){
    let connection = await this.#bdPool.getConnection();
    let queryResult = await connection.query(`SELECT * FROM counter_type;`);
    connection.release();
    return queryResult[0];
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
