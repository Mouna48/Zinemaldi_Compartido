<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
    <style>
        .table-container { width: 100%; overflow-x: auto; background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); margin-top: 20px; }
        table { border-collapse: collapse; width: 100%; font-family: Arial; }
        th { background-color: #000; color: #fff; padding: 12px; text-transform: uppercase; font-size: 13px; }
        td { padding: 10px; text-align: center; border-bottom: 1px solid #ddd; font-size: 14px; color: #333; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        h2 { text-align: center; color: #333; }
    </style>

    <h2>Emisiones de Películas</h2>
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>ID Emisión</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>ID Película</th>
                    <th>ID Sala</th>
                </tr>
            </thead>
            <tbody>
                <xsl:for-each select="Emisiones/Emision">
                <tr>
                    <td><xsl:value-of select="IDEmision"/></td>
                    <td><strong><xsl:value-of select="Fecha"/></strong></td>
                    <td><xsl:value-of select="Hora"/></td>
                    <td><xsl:value-of select="IDPelicula"/></td>
                    <td><xsl:value-of select="IDSala"/></td>
                </tr>
                </xsl:for-each>
            </tbody>
        </table>
    </div>
</xsl:template>
</xsl:stylesheet>