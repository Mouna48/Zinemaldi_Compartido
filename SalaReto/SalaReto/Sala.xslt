<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">

<html>
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Listado de Salas</title>

    <style>
        body {
            font-family: "Arial", sans-serif;
            background-color: #f4f6f8;
            padding: 10px;
            margin: 0;
        }

        h2 {
            text-align: center;
            color: #333;
            margin: 20px 0;
        }

        .table-container {
            width: 100%;
            overflow-x: auto;
            background-color: white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            border-radius: 8px;
            margin-bottom: 20px;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            min-width: 400px;
        }

        th {
            background-color: #000000;
            color: #ffffff;
            padding: 12px;
            text-transform: uppercase;
            font-size: 13px;
            text-align: center;
        }

        td {
            padding: 10px;
            text-align: center;
            border-bottom: 1px solid #ddd;
            color: #333;
            font-size: 14px;
        }

        tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        tr:hover {
            background-color: #e6f2ff;
        }
    </style>
</head>

<body>

<h2>Salas disponibles</h2>

<div class="table-container">
    <table>
        <tr>
            <th>Nombre</th>
            <th>Capacidad</th>
        </tr>

        <xsl:for-each select="Salas/Sala">
            <tr>
                <td><strong><xsl:value-of select="Nombre"/></strong></td>
                <td><xsl:value-of select="Capacidad"/></td>
            </tr>
        </xsl:for-each>

    </table>
</div>

</body>
</html>

</xsl:template>
</xsl:stylesheet>