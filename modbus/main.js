// Конструктор.

function Query() {

    this.Url = '/cgi-bin/modules/modbus/action.cgi';
}

Query.prototype = {

ajax: function( request ) {

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {

        if ( this.readyState == 4 && this.status == 200 ) {

            request.success( xhr.responseText );
        }

    };

    xhr.open( request.type, request.url, request.async );

    xhr.send( JSON.stringify( request.data ) );
},

    Load: function () {

        this.ajax({

            url: this.Url,
            type: 'POST',
            async: true,
            data: { action : 'loadquery' },
            success: function( data ) { document.getElementById( 'function' ).value = Base64.decode( data ); },
            dataType: 'text'
        });

    },

    Save: function() {

        this.ajax({

            url: this.Url,
            type: 'POST',
            async: true,
            data: { action : 'savequery', data : Base64.encode( document.getElementById( 'function' ).value ) },
            success: function( data ) {},
            dataType: 'json'
        });

    },

    LoadLog: function() {

        this.ajax({

            url: this.Url,
            type: 'POST',
            async: true,
            data: { action : 'loadlog' },
            success: function( data ) {

                var d = document.getElementById( 'debug');

                d.style.width = '100%';
                d.style.height = '400';
                d.value = data;
            },
            dataType: 'json'
        });
    },

    ClearLog: function() {

        this.ajax({

            url: this.Url,
            type: 'POST',
            async: true,
            data: { action : 'clearlog' },
            success: function( data ) {},
            dataType: 'json'
        });

        document.getElementById( 'debug' ).value = '';
    },

    Execute: function() {

        ( new Function( document.getElementById( 'function' ).value ) )();
    }
}


function TabControl() {

    this.ItemHeader = null;
    this.ItemName = 'TabQuery';
}

TabControl.prototype = {

    OnTabChange: function() {

        switch ( this.ItemName ) {

            // Загрузка текста запроса.
            case 'TabQuery': { break; }

            // Отладочный журнал.
            case 'TabDebug': { query.LoadLog(); break; }

        }

    },

    Select: function( sender, value ) {

        // Скрываем текущую вкладку.
        document.getElementById( this.ItemName ).className = 'hidden';

        // Показываем заданную.
        document.getElementById( value ).className = 'visible';

        // Объединяем рамку заголовка вкладки с её содержимым.
        if ( this.ItemHeader ) this.ItemHeader.style.borderBottomColor = '#E1E1E1';
        sender.style.borderBottomColor = '#FFFFFF';

        // Сохраняем параметры текущей вкладки.
        this.ItemName = value;
        this.ItemHeader = sender;

        // Обновляем содержимое текущей вкладки.
        this.OnTabChange();
    }

}

// Глобальные объекты.

var query = new Query();
var tab = new TabControl();
var modbus = new Modbus();
