<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
<html>
<head>
    <meta charset="UTF-8"/>
    <title>Listado de Películas</title>

    <style>
        body {
            /* Fuente solicitada */
            font-family: "arial", sans-serif;
            background-color: #f4f6f8;
            padding: 20px;
        }

        h2 {
            text-align: center;
            color: #333;
        }

        table {
            border-collapse: collapse;
            margin: auto;
            width: 90%;
            background-color: white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        th {
            /* Header en negro y letra en blanco */
            background-color: #000000;
            color: #ffffff;
            padding: 12px;
            text-transform: uppercase;
            font-size: 14px;
        }

        td {
            padding: 10px;
            text-align: center;
            border-bottom: 1px solid #ddd;
            color: #333;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        tr:hover {
            background-color: #e6f2ff;
        }
    </style>
</head>
<body>

<h2>Películas disponibles</h2>

<table>
    <tr>
        <th>ID</th>
        <th>Título</th>
        <th>Director</th>
        <th>Duración (min)</th>
        <th>Género</th>
        <th>Año</th>
        <th>País</th>
    </tr>

    <xsl:for-each select="peliculas/pelicula">
        <tr>
            <td><xsl:value-of select="IDPelicula"/></td>
            <td><xsl:value-of select="Titulo"/></td>
            <td><xsl:value-of select="Director"/></td>
            <td><xsl:value-of select="Duracion"/></td>
            <td><xsl:value-of select="Genero"/></td>
            <td><xsl:value-of select="AñoLanzamiento"/></td>
            <td><xsl:value-of select="Pais"/></td>
        </tr>
    </xsl:for-each>
</table>

</body>
</html>
</xsl:template>

</xsl:stylesheet>