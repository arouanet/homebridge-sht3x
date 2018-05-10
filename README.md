# homebridge-sht3x

[![Build Status](https://travis-ci.org/arouanet/homebridge-sht3x.svg?branch=master)](https://travis-ci.org/arouanet/homebridge-sht3x)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[Homebridge](https://github.com/nfarina/homebridge#readme) plugin for the
[Sensirion SHT3x](https://www.sensirion.com/en/environmental-sensors/humidity-sensors/digital-humidity-sensors-for-various-applications/)
humidity and temperature sensor. Uses
[raspi-node-sht31](https://github.com/aphotix/raspi-node-sht31) to communicate
with the device.

<img src="images/sht31-sensor.jpg" alt="SHT31 sensor" width="150" height="150" align="right">

This has only been tested on a Raspberry Pi, but should work with any
Linux-based board supported by [i2c-bus](https://github.com/fivdi/i2c-bus),
including C.H.I.P., BeagleBone, or Intel Edison.

Refer to your board documentation for instructions on how to enable the I²C
interface and how to connect an I²C device. The
[i2c-bus documentation](https://github.com/fivdi/i2c-bus#readme) also includes a
few examples.

## Installation

Node.js v6 or greater is required.

This assumes Homebridge has already been installed. If not, see the
[Homebridge documentation](https://github.com/nfarina/homebridge#installation)
for more information. Then install this plugin using:

```
npm install -g homebridge-sht3x
```

## Configuration

The minimal accessory configuration, containing only the required attributes, is
as follows:

```json
"accessories": [
  {
   "accessory": "SHT3x",
   "name": "SHT31"
  }
]
```

See [config-sample.json](config-sample.json) for a complete example.

The following table shows the list of supported configuration parameters:

| Attribute   | Description                                                                    |
| ----------- | ------------------------------------------------------------------------------ |
| `accessory` | Accessory name registered with Homebridge. Has to be `"SHT3x"`.                |
| `name`      | Display name for the sensor. Can be anything you want.                         |
| `address`   | I²C address of the sensor. Possible values are `"0x44"` (default) or `"0x45"`. |
| `bus`       | I²C bus number. Defaults to `1`. See below.                                    |
| `interval`  | Time interval at which the device is polled, in seconds (default: `60`).       |

The default I²C bus number (`1`) is used by most Raspberry Pi models, except for
the early Raspberry Pi Model B (256MB) which uses bus number `0`. On other
boards, available buses typically are `1` or `2` on a C.H.I.P., `0`, `1`, or `2`
on a BeagleBone, and `1` or `6` on an Intel Edison. Consult your board
documentation for details, and run `i2cdetect -l` to list the available I²C
buses.

The I²C address for the SHT3x sensor is `0x44` by default, or `0x45` if the ADDR
pin is connected to logic high.

## Screenshot

<img src="images/home-app.png" alt="Home app" width="375" height="667">
