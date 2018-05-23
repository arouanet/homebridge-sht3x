const os = require('os')

const moment = require('moment')
const SHT3xSensor = require('raspi-node-sht31')

let Service, Characteristic
let FakeGatoHistoryService

class SHT3xAccessory {
  constructor (log, config) {
    this.log = log
    this.displayName = config.name
    this.interval = config.interval || 60
    this.historyOptions = config.history || {}

    const address = parseInt(config.address, 16) || 0x44
    const bus = config.bus || 1

    this.log(`Expecting SHT3x I²C sensor at address 0x${address.toString(16)} on bus ${bus}`)
    this.sensor = new SHT3xSensor(address, bus)
  }

  pollSensorData () {
    this.sensor.readSensorData().then((data) => {
      const { temperature, humidity } = data

      this.log(`The current temperature is ${temperature.toFixed(2)} °C`)
      this.log(`The current relative humidity is ${humidity.toFixed(2)} %`)

      this.historyService.addEntry({time: moment().unix(), temp: temperature, humidity: humidity})

      this.data = data
    }).catch(err => this.log(err.message))
  }

  getSensorData (dataFunction, callback) {
    if (this.data === undefined) {
      callback(new Error('No data'))
    } else {
      callback(null, dataFunction(this.data))
    }
  }

  getServices () {
    const informationService = new Service.AccessoryInformation()
    informationService
      .setCharacteristic(Characteristic.Manufacturer, 'Sensirion')
      .setCharacteristic(Characteristic.Model, 'SHT3x')
      .setCharacteristic(Characteristic.SerialNumber, `${os.hostname()}-${this.displayName}`)

    const temperatureService = new Service.TemperatureSensor()
    temperatureService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', this.getSensorData.bind(this, data => data.temperature))

    const humidityService = new Service.HumiditySensor()
    humidityService
      .getCharacteristic(Characteristic.CurrentRelativeHumidity)
      .on('get', this.getSensorData.bind(this, data => data.humidity))

    humidityService.isPrimaryService = true
    humidityService.linkedServices = [temperatureService]

    this.historyService = new FakeGatoHistoryService('weather', this, this.historyOptions)

    setInterval(this.pollSensorData.bind(this), this.interval * 1000)
    this.pollSensorData()

    return [informationService, temperatureService, humidityService, this.historyService]
  }
}

module.exports = (homebridge) => {
  ({ Service, Characteristic } = homebridge.hap)
  FakeGatoHistoryService = require('fakegato-history')(homebridge)

  homebridge.registerAccessory('homebridge-sht3x', 'SHT3x', SHT3xAccessory)
}
