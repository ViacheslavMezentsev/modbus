#!/bin/sh

LOGFILE=/www/modules/modbus/log.txt
JSON=/www/cgi-bin/modules/modbus/json.cgi

# Ведение журнала.
loginfo () {

    lcnt=$(wc -l $LOGFILE | cut -f1 -d' ')
    
    # Ограничиваем размер файла журнала по количеству строк.
    if [ $lcnt -gt 100 ] ; then
    
        start=`expr $lcnt - 50`
        tail +$start $LOGFILE > /tmp/log.txt
        mv /tmp/log.txt $LOGFILE
        
    fi
    
    echo "`date +"%Y.%m.%d %H:%M:%S [INFO:$$]"` $1" >> $LOGFILE
}

# Расчёт CRC16.
crc () {

    # Преобразуем выражение в строку.
    str="$1"
    
    # Расчитываем количество циклов.
    cnt=$((${#1}-2))
    
    # Начальное значение.
    crc=0xFFFF

    for i in `seq 0 2 $cnt`; do

        crc=$(( crc ^ 0x${str:$i:2} ))

        for j in `seq 0 7`; do

            c=$(( crc >> 1 ))

            if [ $(( crc & 1 )) = 1 ]; then                 

                let 'c ^= 0xA001'
            fi

            crc=$c

        done

    done
    
    # Меняем местами байты.
    c=$(( crc & 0xFF ))
    c=$(( c << 8 ))
    crc=$(( crc >> 8 ))
    crc=$(( crc + c ))
    
    # Переводим в hex вид.
    echo `printf "%04X" $crc`
}

echo "Content-type: text/html; charset=utf-8"
echo

if [ "$REQUEST_METHOD" = POST ]; then
     
    read -n $CONTENT_LENGTH query
    #loginfo "POST $query"
     
elif [ "$REQUEST_METHOD" = GET ]; then     
    
    query=$(echo "$QUERY_STRING")
    #loginfo "GET $query"
else

    exit 0
fi

# Разбор запроса.
if [ -n "$query" ]; then

    # Разбор json.
    query=$(echo $query | $JSON -l)
    
    # Проверка типа действия.
    action=$(echo "$query" | egrep '\["action"\]' | cut -f2 | egrep -o '[^"]*')
             
    case "$action" in

        # Состояние.
        "query")
        
            # Настройки линии.                
            tty=$(echo "$query" | egrep '\["serial","Name"\]' | cut -f2 | egrep -o '[^"]*')
            
            BaudRate=$(echo "$query" | egrep '\["serial","BaudRate"\]' | cut -f2)
           
            case "$BaudRate" in
                
                0) baud=300;;
                1) baud=600;;
                2) baud=1200;; 
                3) baud=2400;; 
                4) baud=4800;; 
                5) baud=9600;;
                6) baud=14400;;
                7) baud=19200;;
                8) baud=38400;;
                9) baud=56000;;
                10) baud=57600;;
                11) baud=115200;;
                12) baud=128000;;
                13) baud=256000;;
                
            esac

            DataBits=$(echo "$query" | egrep '\["serial","DataBits"\]' | cut -f2)
            
            case "$DataBits" in
            
                0) bits=cs7;;
                1) bits=cs8;;
            
            esac
            
            # TODO: Parity, StopBits
            
            Timeout=$(echo "$query" | egrep '\["serial","Timeout"\]' | cut -f2)"e-3"
    
            data=$(echo "$query" | egrep '\["data"\]' | cut -f2 | egrep -o '[^"]*')
            
            ans=/tmp/ans.dat
            
            # Сброс параметров.
            stty -F $tty 4:0:18b2:0:0:0:0:0:1:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0

            # Настройка.
            stty -F $tty raw $baud $bits

            # Готовимся к приёму ответа.
            ( dd if=$tty of=$ans count=256 2> /dev/null ) &

            # Задержка на подготовку.
            /usr/bin/sleep 20e-3

            # Добавляем crc.            
            data=$data$(crc $data)

            # Записываем событие в журнал.
            tmp=$(printf "$data" | hexdump -ve '/1 "0x%02X_"' | sed 's/\(.*\)_/\1/')
            loginfo "( => ) $tmp" 

            # Кодируем данные.
            str="$data"
            cnt=$((${#str}-2))
            for i in `seq 0 2 $cnt`; do tmp2=$tmp2"\x${str:$i:2}"; done

            # Выполняем запрос.
            printf $tmp2 > $tty

            # Принимаем ответ.
            /usr/bin/sleep $Timeout; kill $!
            
            loginfo "( <= ) `hexdump -ve '/1 "0x%02X_"' $ans | sed 's/\(.*\)_/\1/'`"
            
            echo "[`hexdump -ve '/1 "%d,"' $ans | sed 's/\(.*\),/\1/'`]"
        ;;       
        
        # Сохранение запроса.
        "savequery")
        
            data=$(echo "$query" | egrep '\["data"\]' | cut -f2 | egrep -o '[^"]*')
            echo "$data" > /www/modules/modbus/func.txt
        ;;

        # Загрузка запроса.
        "loadquery") echo `cat /www/modules/modbus/func.txt` ;;

        # Отладочный журнал..
        "loadlog") echo `cat $LOGFILE | sed ':a;N;$!ba;s/\n/\r/g'` ;;
        
        "clearlog") `echo "" > $LOGFILE` ;;


    esac

fi
