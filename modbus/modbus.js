// Литература:
//
// Enums in Javascript: http://stijndewitt.wordpress.com/2014/01/26/enums-in-javascript/
// Enums in JavaScript?: http://stackoverflow.com/questions/287903/enums-in-javascript

// Глобальные константы.

const READ_COILS = 0x01;
const READ_DISCRETE_INPUTS = 0x02;
const READ_HOLDING_REGISTERS = 0x03;
const READ_INPUT_REGISTERS = 0x04;
const WRITE_SINGLE_COIL = 0x05;
const WRITE_SINGLE_REGISTER = 0x06;
const WRITE_MULTIPLE_REGISTERS = 0x10;


// Перечисления.

var EnModbusProtocolMode = {

    mbProtocolModeRTU: 0,
    mbProtocolModeASCII: 1
};

var EnModbusBaudRate = {

    mbBaudRate300: 0,
    mbBaudRate600: 1,
    mbBaudRate1200: 2,
    mbBaudRate2400: 3,
    mbBaudRate4800: 4,
    mbBaudRate9600: 5,
    mbBaudRate14400: 6,
    mbBaudRate19200: 7,
    mbBaudRate38400: 8,
    mbBaudRate56000: 9,
    mbBaudRate57600: 10,
    mbBaudRate115200: 11,
    mbBaudRate128000: 12,
    mbBaudRate256000: 13
};

var EnModbusDataBits = {

    mbDataBits7Bits: 0,
    mbDataBits8Bits: 1
};

var EnModbusParity = {

    mbParityNone: 0,
    mbParityOdd: 1,
    mbParityEven: 2
};

var EnModbusStopBits = {

    mbStopBitsOne: 0,
    mbStopBitsTwo: 1
};

// Глобальные переменные.

var CRC_HI = [
  0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
  0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
  0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
  0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
  0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
  0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
  0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
  0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
  0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
  0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
  0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
  0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
  0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
  0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
  0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
  0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
  0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
  0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
  0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
  0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
  0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
  0x00, 0xC1, 0x81, 0x40
];

var CRC_LO = [
  0x00, 0xC0, 0xC1, 0x01, 0xC3, 0x03, 0x02, 0xC2, 0xC6, 0x06, 0x07, 0xC7,
  0x05, 0xC5, 0xC4, 0x04, 0xCC, 0x0C, 0x0D, 0xCD, 0x0F, 0xCF, 0xCE, 0x0E,
  0x0A, 0xCA, 0xCB, 0x0B, 0xC9, 0x09, 0x08, 0xC8, 0xD8, 0x18, 0x19, 0xD9,
  0x1B, 0xDB, 0xDA, 0x1A, 0x1E, 0xDE, 0xDF, 0x1F, 0xDD, 0x1D, 0x1C, 0xDC,
  0x14, 0xD4, 0xD5, 0x15, 0xD7, 0x17, 0x16, 0xD6, 0xD2, 0x12, 0x13, 0xD3,
  0x11, 0xD1, 0xD0, 0x10, 0xF0, 0x30, 0x31, 0xF1, 0x33, 0xF3, 0xF2, 0x32,
  0x36, 0xF6, 0xF7, 0x37, 0xF5, 0x35, 0x34, 0xF4, 0x3C, 0xFC, 0xFD, 0x3D,
  0xFF, 0x3F, 0x3E, 0xFE, 0xFA, 0x3A, 0x3B, 0xFB, 0x39, 0xF9, 0xF8, 0x38,
  0x28, 0xE8, 0xE9, 0x29, 0xEB, 0x2B, 0x2A, 0xEA, 0xEE, 0x2E, 0x2F, 0xEF,
  0x2D, 0xED, 0xEC, 0x2C, 0xE4, 0x24, 0x25, 0xE5, 0x27, 0xE7, 0xE6, 0x26,
  0x22, 0xE2, 0xE3, 0x23, 0xE1, 0x21, 0x20, 0xE0, 0xA0, 0x60, 0x61, 0xA1,
  0x63, 0xA3, 0xA2, 0x62, 0x66, 0xA6, 0xA7, 0x67, 0xA5, 0x65, 0x64, 0xA4,
  0x6C, 0xAC, 0xAD, 0x6D, 0xAF, 0x6F, 0x6E, 0xAE, 0xAA, 0x6A, 0x6B, 0xAB,
  0x69, 0xA9, 0xA8, 0x68, 0x78, 0xB8, 0xB9, 0x79, 0xBB, 0x7B, 0x7A, 0xBA,
  0xBE, 0x7E, 0x7F, 0xBF, 0x7D, 0xBD, 0xBC, 0x7C, 0xB4, 0x74, 0x75, 0xB5,
  0x77, 0xB7, 0xB6, 0x76, 0x72, 0xB2, 0xB3, 0x73, 0xB1, 0x71, 0x70, 0xB0,
  0x50, 0x90, 0x91, 0x51, 0x93, 0x53, 0x52, 0x92, 0x96, 0x56, 0x57, 0x97,
  0x55, 0x95, 0x94, 0x54, 0x9C, 0x5C, 0x5D, 0x9D, 0x5F, 0x9F, 0x9E, 0x5E,
  0x5A, 0x9A, 0x9B, 0x5B, 0x99, 0x59, 0x58, 0x98, 0x88, 0x48, 0x49, 0x89,
  0x4B, 0x8B, 0x8A, 0x4A, 0x4E, 0x8E, 0x8F, 0x4F, 0x8D, 0x4D, 0x4C, 0x8C,
  0x44, 0x84, 0x85, 0x45, 0x87, 0x47, 0x46, 0x86, 0x82, 0x42, 0x43, 0x83,
  0x41, 0x81, 0x80, 0x40
];


// Функции.

function dec2hex(i) {

    var result = "";

    if ( i >= 0 && i <= 15 ) { 
        
        result += "0" + i.toString(16); 
    
    } else if ( i >= 16 && i <= 255 ) { 
        
        result += "" + i.toString(16); 
    }
    
    return result.toUpperCase();
}


// Конструктор.
function Modbus() {

    // Свойства.

    // Путь к скрипту.
    this.Url = '/cgi-bin/modules/modbus/action.cgi';

    // Задержка между запросами.
    this.DelayBetweenPoll = 100;

    // Массив задач.
    this.Tasks = [];

    // Настройки последовательного порта.
    this.Serial = {

        Name: '/dev/ttyATH0',
        BaudRate: EnModbusBaudRate.mbBaudRate9600,
        DataBits: EnModbusDataBits.mbDataBits8Bits,
        Parity: EnModbusParity.mbParityNone,
        StopBits: EnModbusStopBits.mbStopBitsOne,
        Timeout: 100
    };

}

Modbus.prototype = {

    // Методы.
    SwapBytes: function( buf, size ) {

        var bytes = new Uint8Array( buf );
        var len = bytes.length;

        if ( size == 'WORD' ) {

            var holder;

            for ( var i = 0; i < len; i += 2 ) {

                holder = bytes[i];
                bytes[i] = bytes[i+1];
                bytes[i+1] = holder;
            }

        } else if ( size == 'DWORD' ) {

            var holder;

            for ( var i = 0; i < len; i += 4 ) {

                holder = bytes[i];
                bytes[i] = bytes[i+3];
                bytes[i+3] = holder;
                holder = bytes[i+1];
                bytes[i+1] = bytes[i+2];
                bytes[i+2] = holder;
            }

        }

    },

    crc16: function( data ) {

        var hi = 0xFF;
        var lo = 0xFF;
        var i;

        for ( var j = 0, l = data.length; j < l; ++j ) {

            i = lo ^ data[j];
            lo = hi ^ CRC_HI[i];
            hi = CRC_LO[i];
        }

        return hi << 8 | lo;
    },


    Coil: function ( handle, n ) {

        for ( var t in this.Tasks ) {

            var task = this.Tasks[t];

            if ( task.handle == handle ) {

                return ( task.buffer[ ~~( n / 8 ) ] >> ( n % 8 ) ) & 1;
            }

        }

    },

    Register: function ( handle, n ) {

        for ( var t in this.Tasks ) {

            var task = this.Tasks[t];

            if ( task.handle == handle ) {

                var len = task.buffer.length;

                var buffer = new ArrayBuffer( len );

                var uint8 = new Uint8Array( buffer );

                for ( var i = 0; i < len; i++ ) uint8[i] = task.buffer[i];

                this.SwapBytes( buffer, 'WORD' );

                var uint16 = new Uint16Array( buffer );

                return uint16[n];
            }

        }

    },

    Fill: function( task, data ) {

        switch ( task.func ) {

            case READ_COILS:
            case READ_DISCRETE_INPUTS:
            case READ_HOLDING_REGISTERS:
            case READ_INPUT_REGISTERS: { task.buffer = data.slice(3); break; }

            case WRITE_SINGLE_COIL:
            case WRITE_SINGLE_REGISTER:
            case WRITE_MULTIPLE_REGISTERS: { task.buffer = data.slice(2); break; }

        }

    },

    OnSuccess: function( handle ) {},

    OnFailure: function( handle, error ) {},

    OnReceive: function( task, data ) {

        var FUNC = task.func;
        var ERROR = 0x80 + task.func;
        var len = data.length;

        if ( len < 5 ) {

            this.OnFailure( task.handle, -1 );
            return;
        }

        // Ошибка.
        if ( data[0] == task.slaveid && data[1] == ERROR ) {

            this.OnFailure( task.handle, data[2] );
        }

        if ( data[0] == task.slaveid && data[1] == FUNC ) {

            // Сохраняем CRC принятых данных.
            var crc1 = ( data[ len - 1 ] << 8 ) + data[ len - 2 ];

            // Убираем CRC из массива данных.
            data.length -= 2;

            var crc2 = this.crc16( data );

            // Если CRC совпадает, то заполняем массивы данных.
            if ( crc1 != crc2 ) {

                this.OnFailure( task.handle, -2 );

            } else {

                // Заполняем массивы с данными.
                this.Fill( task, data );

                // Выполняем обработчик успешного выполнения запроса.
                this.OnSuccess( task.handle );
            }

        }

    },

    ajax: function( request ) {

        var xhr = new XMLHttpRequest();

        xhr.open( request.type, request.url, request.async );

        xhr.onreadystatechange = function() {

            if ( this.readyState == 4 && this.status == 200 ) {

                request.success( JSON.parse( xhr.responseText ) );
            }

        };

        xhr.send( JSON.stringify( request.data ) );
    },


    Post: function( task ) {

        var self = this;
        var bytes = [];

        try {

            bytes.push( task.slaveid );
            bytes.push( task.func );
            bytes.push( task.address >> 8 );
            bytes.push( task.address & 0xFF );

            if ( task.func == WRITE_MULTIPLE_REGISTERS ) {

                bytes.push( task.value.length >> 8 );
                bytes.push( task.value.length & 0xFF );
                bytes.push( 2 * task.value.length );
             
                for ( var n = 0; n < task.value.length; n++ ) {

                    bytes.push( task.value[n] >> 8 );
                    bytes.push( task.value[n] & 0xFF );
                }

            } else {

                bytes.push( task.value >> 8 );
                bytes.push( task.value & 0xFF );
            }

            // CRC высчитывается на стороне shell-скрипта.
            
            // Преобразуем массив в строку.
            var adu = '';

            for ( var b in bytes ) adu += dec2hex( bytes[b] );

            this.ajax({

                url: this.Url,
                type: 'POST',
                async: false,
                data: { action: 'query', serial: this.Serial, data: adu },
                success: function( data ) { self.OnReceive( task, data ); },
                dataType: 'json'
            });

        } catch ( ex ) {

            console.error( ex );
        }

    },


    OnTimer: function( task ) {

        var self = this;

        this.Post( task );

        // Задержка между запросами.
        setTimeout( function(){}, self.DelayBetweenPoll );
    },


    // Use this function to enable a task identified by the handle.
    UpdateEnable: function( handle ) {

        var self = this;

        for ( var t in this.Tasks ) {

            var task = this.Tasks[t];

            if ( task.handle == handle ) {

                clearInterval( task.timerid );
                task.timerid = setInterval( function() { self.OnTimer( task ); }, task.updaterate );

                return;
            }

        }

    },


    // Use this function to temporary disable a task identified by the handle.
    UpdateDisable: function( handle ) {

        for ( var t in this.Tasks ) {

            var task = this.Tasks[t];

            if ( task.handle == handle ) {

                clearInterval( task.timerid );

                return;
            }

        }

    },

    // Use this function to enable a task identified by the handle once.
    UpdateOnce: function( handle ) {

        var self = this;

        for ( var t in this.Tasks ) {

            var task = this.Tasks[t];

            if ( task.handle == handle ) {

                task.timerid = setTimeout( function() { self.OnTimer( task ); }, task.updaterate );

                return;
            }

        }

    },


    // Добавляем задачу.
    AddTask: function( task ) {

        for ( var t in this.Tasks ) {

            if ( task.handle == this.Tasks[t].handle ) {

                this.Tasks[t] = task;

                return;
            }

        }

        this.Tasks.push( task );
    },

    // This function code is used to read from 1 to 2000 contiguous status of coils in a remote device.
    // The Request PDU specifies the starting address, i.e. the address of the first coil specified,
    // and the number of coils. In the PDU Coils are addressed starting at zero. Therefore coils
    // numbered 1-16 are addressed as 0-15.
    //
    // The coils in the response message are packed as one coil per bit of the data field. Status
    // is indicated as 1= ON and 0= OFF. The LSB of the first data byte contains the output addressed
    // in the query. The other coils follow toward the high order end of this byte, and from low order
    // to high order in subsequent bytes.
    //
    // If the returned output quantity is not a multiple of eight, the remaining bits in the final data
    // byte will be padded with zeros (toward the high order end of the byte). The Byte Count field
    // specifies the quantity of complete bytes of data.
    ReadCoils: function( handle, slaveid, address, quantity, updaterate ) {

        // Starting Address: 0x0000 to 0xFFFF.
        // Quantity of Inputs: 1 to 2000 (0x7D0).
        this.AddTask(
            {
                buffer: [],
                timerid: -1,
                handle: handle,
                slaveid: slaveid,
                func: READ_COILS,
                address: address,
                value: quantity,
                updaterate: updaterate
            }
        );

    },


    // This function code is used to read from 1 to 2000 contiguous status of discrete inputs in a
    // remote device. The Request PDU specifies the starting address, i.e. the address of the first
    // input specified, and the number of inputs. In the PDU Discrete Inputs are addressed starting
    // at zero. Therefore Discrete inputs numbered 1-16 are addressed as 0-15.
    //
    // The discrete inputs in the response message are packed as one input per bit of the data field.
    // Status is indicated as 1= ON; 0= OFF. The LSB of the first data byte contains the input addressed
    // in the query. The other inputs follow toward the high order end of this byte, and from low order
    // to high order in subsequent bytes.
    //
    // If the returned input quantity is not a multiple of eight, the remaining bits in the final data
    // byte will be padded with zeros (toward the high order end of the byte). The Byte Count field
    // specifies the quantity of complete bytes of data.
    ReadDiscreteInputs: function( handle, slaveid, address, quantity, updaterate ) {

        // Starting Address: 0x0000 to 0xFFFF.
        // Quantity of Inputs: 1 to 2000 (0x7D0).
        this.AddTask(
            {
                buffer: [],
                timerid: -1,
                handle: handle,
                slaveid: slaveid,
                func: READ_DISCRETE_INPUTS,
                address: address,
                value: quantity,
                updaterate: updaterate
            }
        );

    },


    // This function code is used to read the contents of a contiguous block of holding registers
    // in a remote device. The Request PDU specifies the starting register address and the number
    // of registers. In the PDU Registers are addressed starting at zero. Therefore registers
    // numbered 1-16 are addressed as 0-15.
    //
    // The register data in the response message are packed as two bytes per register, with the
    // binary contents right justified within each byte. For each register, the first byte contains
    // the high order bits and the second contains the low order bits.
    ReadHoldingRegisters: function( handle, slaveid, address, quantity, updaterate ) {

        // Starting Address: 0x0000 to 0xFFFF.
        // Quantity of Inputs: 1 to 125 (0x7D).
        this.AddTask(
            {
                buffer: [],
                timerid: -1,
                handle: handle,
                slaveid: slaveid,
                func: READ_HOLDING_REGISTERS,
                address: address,
                value: quantity,
                updaterate: updaterate
            }
        );

    },


    // This function code is used to read from 1 to 125 contiguous input registers in a remote device.
    // The Request PDU specifies the starting register address and the number of registers. In the
    // PDU Registers are addressed starting at zero. Therefore input registers numbered 1-16 are
    // addressed as 0-15.
    //
    // The register data in the response message are packed as two bytes per register, with the
    // binary contents right justified within each byte. For each register, the first byte contains the
    // high order bits and the second contains the low order bits.
    ReadInputRegisters: function( handle, slaveid, address, quantity, updaterate ) {

        // Starting Address: 0x0000 to 0xFFFF.
        // Quantity of Input Registers: 0x0001 to 0x007D.
        this.AddTask(
            {
                buffer: [],
                timerid: -1,
                handle: handle,
                slaveid: slaveid,
                func: READ_INPUT_REGISTERS,
                address: address,
                value: quantity,
                updaterate: updaterate
            }
        );

    },


    // This function code is used to write a single output to either ON or OFF in a remote device.
    // The requested ON/OFF state is specified by a constant in the request data field. A value of FF
    // 00 hex requests the output to be ON. A value of 00 00 requests it to be OFF. All other values
    // are illegal and will not affect the output.
    WriteSingleCoil: function( handle, slaveid, address, value, updaterate ) {

        // Output Address: 0x0000 to 0xFFFF.
        // Output Value: 0x0000 to 0xFFFF.
        this.AddTask(
            {
                buffer: [],
                timerid: -1,
                handle: handle,
                slaveid: slaveid,
                func: WRITE_SINGLE_COIL,
                address: address,
                value: value,
                updaterate: updaterate
            }
        );

    },


    // This function code is used to write a single holding register in a remote device.
    // The Request PDU specifies the address of the register to be written. Registers are addressed
    // starting at zero. Therefore register numbered 1 is addressed as 0.
    // The normal response is an echo of the request, returned after the register contents have been
    // written.
    WriteSingleRegister: function( handle, slaveid, address, value, updaterate ) {

        // Register Address: 0x0000 to 0xFFFF.
        // Register Value: 0x0000 to 0xFFFF.
        this.AddTask(
            {
                buffer: [],
                timerid: -1,
                handle: handle,
                slaveid: slaveid,
                func: WRITE_SINGLE_REGISTER,
                address: address,
                value: value,
                updaterate: updaterate
            }
        );

    },

    // This function code is used to write a block of contiguous registers (1 to 123 registers) in a
    // remote device.
    // The requested written values are specified in the request data field. Data is packed as two
    // bytes per register.
    // The normal response returns the function code, starting address, and quantity of registers
    // written.
    WriteMultipleRegisters: function( handle, slaveid, address, values, updaterate ) {

        // Starting Address: 0x0000 to 0xFFFF.
        // Quantity of Registers: 0x0001 to 0x007B.
        this.AddTask(
            {
                buffer: [],
                timerid: -1,
                handle: handle,
                slaveid: slaveid,
                func: WRITE_MULTIPLE_REGISTERS,
                address: address,
                value: values,
                updaterate: updaterate
            }
        );

    }

}
