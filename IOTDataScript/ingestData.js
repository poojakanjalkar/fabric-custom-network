const axios = require("axios");
const url = "http://localhost:3000/v1/sensors";

// const { nanoid } = require('nanoid');
const { staticUser } = require("../api/src/utils/bootstrap");
const config = require("../api/src/config/config");

const login = async () => {
	let d = {
		"email": staticUser[0].email,
		"password": config.commonPassword
	}
	try {
		let resp = await axios.post("http://localhost:3000/v1/auth/login", d, { headers: { "Content-Type": "application/json" } })
		return resp.data.payload.access.token
	} catch (error) {
		return error
	}
}


const test = async () => {
	let token = await login()
	console.log(token)
}

// test()

// type: body.type,
// id: getUUID(),
// deviceId: body.deviceId,
// cattleId:body.cattleId,
// temperature: body.temperature,
// tempUnit:body.tempUnit,
// location: body.location,
// batteryLevel:body.batteryLevel,
// captureDate: new Date(),
// orgId: parseInt(user.orgId),
// createdBy: user.email,
// updatedBy: user.email,



const addSensorData = async (pk) => {

	let token = await login()
	console.log(token)

	setInterval(() => {
		console.log("inside")
		for (let i=0; i < 1; i++) {

			// let data = {
			// 	"type": "Temperature",
      //   "deviceId":"123",
      //   "cattleId": "CAT123",
      //   "temperature": 23,
      //   "tempUnit": "C",
      //   // "location":,
      //   "batteryLevel": 11.2,
			// }

			let data = {
				"type": "Location",
        "deviceId":"D1",
        "cattleId": "CAT11",
        // "temperature": 23,
        // "tempUnit": "C",
        "location":{"lat":120.222, long:12.6675},
        "batteryLevel": 91.2,
			}


			return axios.post(url, data, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json"
				}
			}
			).then(resp => {
				console.log(resp.data)
			}
			).catch(function (error) { console.log(error); });

		}

	}, 2000)

};

addSensorData()
