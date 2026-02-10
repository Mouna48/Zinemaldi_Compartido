<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
<html>
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Listado de Películas</title>

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

        /* Contenedor para scroll horizontal en móviles */
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
            width: 100%; /* Ocupa el 100% del contenedor */
            min-width: 700px; /* Evita que las columnas se aplasten en móvil */
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

        /* Ajustes para pantallas muy pequeñas */
        @media screen and (max-width: 600px) {
            h2 { font-size: 1.2rem; }
            td, th { padding: 8px; font-size: 12px; }
        }
    </style>
</head>
<body>

<h2>Películas disponibles</h2>

<div class="table-container">
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
                <td><strong><xsl:value-of select="Titulo"/></strong></td>
                <td><xsl:value-of select="Director"/></td>
                <td><xsl:value-of select="Duracion"/>'</td>
                <td><xsl:value-of select="Genero"/></td>
                <td><xsl:value-of select="AñoLanzamiento"/></td>
                <td><xsl:value-of select="Pais"/></td>
            </tr>
        </xsl:for-each>
    </table>
</div>

</body>
</html>
</xsl:template>

</xsl:stylesheet>