"use strict";

const { Contract, Transaction } = require("fabric-contract-api");
const geolib = require('geolib');
const MAX_DISTANCE_COVERED_IN_10_MIN = 1
class TrustScore extends Contract {

  async CreateAsset(ctx, assetData) {
    try {
      let asset = JSON.parse(assetData)
      await ctx.stub.putState(asset.id, assetData);
      return ctx.stub.getTxID();
    } catch (err) {
      throw new Error(err.stack);
    }    
  }

  async AddSensorReading(ctx, assetData, lastReadingId) {
    try {
      console.log("-----------------AddSensorReading-----------0---------", assetData, lastReadingId)
      let asset = JSON.parse(assetData)
      await ctx.stub.putState(asset.id, assetData);
      await this.updateTrustScore(ctx, asset, lastReadingId)
      return ctx.stub.getTxID();
    } catch (err) {
      throw new Error(err.stack);
    }    
  }



  async updateTrustScore(ctx, data, lastReadingId){
    console.log("-----------------Updating trust score 1--------------------", data, lastReadingId)

    if(data.docType == 'SensorData'){
      console.log("-----------------Updating trust score 2 Sensor data--------------------")

      let deviceData = await ctx.stub.getState(data.deviceId)
      let lastReading =lastReadingId? await ctx.stub.getState(lastReadingId): null
      if(lastReading && lastReading.length > 0){
        lastReading = JSON.parse(lastReading)
      }

      console.log("-----------------Updating trust score 3----------device data, lastReading Data----------", deviceData, lastReading)
      
      if(data.type == 'Location' ){

        let temporalCorelation ;
        if(lastReading){
          const start = { latitude : data?.location?.lat, longitude: data?.location?.long}
          const end =  { latitude : lastReading?.location?.lat, longitude: lastReading?.location?.long}
          const distance = geolib.getDistance(start, end);
          console.log("-----------------Updating trust score 4 ------------distance-------", distance)
          temporalCorelation = distance > MAX_DISTANCE_COVERED_IN_10_MIN ? 0:1
        }else{
          temporalCorelation = 1
        }
        let calibrationScore = 0
        if(deviceData){
          let d2 = new Date( deviceData.calibrationExpiryDate)
          let d1 = new Date( data.createdAt)
          calibrationScore = d2.getTime() > d1.getTime() ? 1: 0
          console.log("-----------------Updating trust score 5 ------------distance-------", calibrationScore)
  
        }
        const batteryLevel = data.batteryLevel> 5? data.batteryLevel/100 : 0
        console.log("-----------------All Score-------", calibrationScore , batteryLevel , temporalCorelation)
        let score = (calibrationScore + batteryLevel + temporalCorelation )/3 || 0

        let scoreData = {
          id:`score_${data.id}`,
          score,
          deviceId:data.deviceId,
          cattleId: data.cattleId,
          scoreDate: data.captureDate,
          captureDate: data.captureDate,
          deviceType:data.deviceType,
          meta: {calibrationScore, batteryLevel, temporalCorelation},
          docType: 'Score'
        }
        console.log("-----------------Updating trust score 6 ------------score-------", JSON.stringify(scoreData))
        await ctx.stub.putState(scoreData.id, JSON.stringify(scoreData)); 
      }
    }else {

    }

  }

  async UpdateAsset(ctx, assetData) {
    try {
      let asset = JSON.parse(assetData)
      const exists = await this.assetExists(asset.id);
      if (!exists) {
        throw new Error(`The asset ${id} does not exist`);
      }
      await ctx.stub.putState(asset.id, assetData);
      return ctx.stub.getTxID();
    } catch (err) {
      throw new Error(err.stack);
    }    
  }


  // ReadAsset returns the asset stored in the world state with given id.
  async getAssetByID(ctx, id) {
    try {
      const assetJSON = await ctx.stub.getState(id);
      if (!assetJSON || assetJSON.length === 0) {
        throw new Error(`The asset ${id} does not exist`);
      }
      return assetJSON.toString();
    } catch (err) {
      throw new Error(err.stack);
    }
  }

 
  // deleteAsset deletes an given asset from the world state.
  async deleteAsset(ctx, id) {
    try {
      const exists = await this.assetExists(ctx, id);
      if (!exists) {
        throw new Error(`The asset ${id} does not exist`);
      }
      return ctx.stub.deleteState(id);
    } catch (err) {
      return new Error(err.stack);
    }
  }

  // assetExists returns true when asset with given ID exists in world state.
  async assetExists(ctx, id) {
    try {
      const assetJSON = await ctx.stub.getState(id);
      return assetJSON && assetJSON.length > 0;
    } catch (err) {
      return new Error(err.stack);
    }
  }

  // getAllAssets returns all assets found in the world state.
  async getAllAssets(ctx) {
    try {
      const allResults = [];
      // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
      const iterator = await ctx.stub.getStateByRange("", "");
      let result = await iterator.next();
      while (!result.done) {
        const strValue = Buffer.from(result.value.value.toString()).toString(
          "utf8"
        );
        let record;
        try {
          record = JSON.parse(strValue);
        } catch (err) {
          console.log(err);
          record = strValue;
        }
        allResults.push({ Key: result.value.key, Record: record });
        result = await iterator.next();
      }
      return JSON.stringify(allResults);
    } catch (err) {
      return new Error(err.message);
    }
  }

  /**
   * Function getAllResults
   * @param {resultsIterator} iterator within scope passed in
   * @param {Boolean} isHistory query string created prior to calling this fn
   */
  async getAllResults(iterator, isHistory) {
    try {
      let allResults = [];
      while (true) {
        let res = await iterator.next();
        console.log(res.value);

        if (res.value && res.value.value.toString()) {
          let jsonRes = {};
          console.log(res.value.value.toString("utf8"));

          if (isHistory && isHistory === true) {
            jsonRes.txId = res.value.txId;
            jsonRes.Timestamp = res.value.timestamp;
            jsonRes.IsDelete = res.value.is_delete
              ? res.value.is_delete.toString()
              : "false";
            try {
              jsonRes.Value = JSON.parse(res.value.value.toString("utf8"));
            } catch (err) {
              console.log(err);
              jsonRes.Value = res.value.value.toString("utf8");
            }
          } else {
            jsonRes.Key = res.value.key;
            try {
              jsonRes.Record = JSON.parse(res.value.value.toString("utf8"));
            } catch (err) {
              console.log(err);
              jsonRes.Record = res.value.value.toString("utf8");
            }
          }
          allResults.push(jsonRes);
        }
        if (res.done) {
          console.log("end of data");
          await iterator.close();
          console.info("allResults : ", allResults);
          return allResults;
        }
      }
    } catch (err) {
      return new Error(err.message);
    }
  }

  /**
   * Function getQueryResultForQueryString
   * getQueryResultForQueryString woerk function executes the passed-in query string.
   * Result set is built and returned as a byte array containing the JSON results.
   * @param {Context} ctx the transaction context
   * @param {any}  self within scope passed in
   * @param {String} the query string created prior to calling this fn
   */
  async getDataForQuery(ctx, queryString) {
    try {
      console.log(
        "- getQueryResultForQueryString queryString:\n" + queryString
      );

      const resultsIterator = await ctx.stub.getQueryResult(queryString);
      let results = await this.getAllResults(resultsIterator, false);

      return results;
    } catch (err) {
      return new Error(err.message);
    }
  }

  /**
   * getAssetHistory takes the asset ID as arg, returns results as JSON
   * @param {String} id the asset ID
   */
  async getAssetHistory(ctx, id) {
    try {
      let resultsIterator = await ctx.stub.getHistoryForKey(id);
      let results = await this.getAllResults(resultsIterator, true);
      console.log("results : ", results);

      return results;
    } catch (err) {
      return new Error(err.stack);
    }
  }

  async getDataWithPagination(ctx, queryString, pageSize, bookmark) {
    try {
      const pageSizeInt = parseInt(pageSize, 10);
      const { iterator, metadata } =
        await ctx.stub.getQueryResultWithPagination(
          queryString,
          pageSizeInt,
          bookmark
        );
      const results = await this.getAllResults(iterator, false);
      let finalData = {
        data: results,
        metadata: {
          RecordsCount: metadata.fetchedRecordsCount,
          Bookmark: metadata.bookmark,
        },
      };
      return finalData;
    } catch (err) {
      return new Error(err.message);
    }
  }
}

module.exports = TrustScore;
