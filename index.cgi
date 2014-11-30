#!/bin/sh

echo "Content-type: text/html; charset=utf-8"
echo
echo "<title>Modbus</title>"
echo "<link type=\"text/css\" rel=\"stylesheet\" href=\"/modules/modbus/style.css\">"
echo "`cat /www/menu.html`"

echo "`cat /www/modules/modbus/main.html`"

if [ -f /tmp/install.sh ]; then

    echo "<pre>`sh /tmp/install.sh`</pre>"
    rm -f /tmp/install.sh
fi

