<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emisiones de Cine - Exportación</title>
    <style>
        body { 
            font-family: "Arial", sans-serif; 
            background-color: #f4f6f8;
            padding: 20px; 
            margin: 0;
        }

        .header-section {
            text-align: center;
            padding: 40px 20px;
        }

        h1 { 
            color: #333; 
            margin-top: 0;
            font-size: 28px;
        }

        .btn-exportar {
            background-color: #000000;
            color: white;
            border: none;
            padding: 16px 40px;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            display: inline-flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
        }

        .btn-exportar:hover {
            background-color: #333;
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }

        .status-box {
            max-width: 800px;
            margin: 20px auto;
            padding: 15px;
            background: white;
            border-radius: 8px;
            border-left: 5px solid #000;
            text-align: left;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .mensaje-inicio { 
            text-align: center; 
            color: #888; 
            margin-top: 50px;
        }

        hr { border: 0; border-top: 1px solid #ddd; margin: 40px 0; }
        table { margin-top: 20px !important; }
    </style>
</head>
<body>

<div class="header-section">
    <h1>Exportar Emisiones a XML</h1>
    <form method="post">
        <button type="submit" name="exportar" class="btn-exportar">
           GENERAR LISTADO DE EMISIONES
        </button>
    </form>
</div>

<?php
// index.php completo para exportar Emisiones a XML y transformarlo con XSLT

if (isset($_POST['exportar'])) {

    // 1. Conexión a MySQL en Docker
    $conexion = new mysqli("db_emisiones", "root", "1DAW3_BBDD", "CineDB");
    if ($conexion->connect_error) {
        die("<div style='color:red; margin:20px;'><strong>Error de conexión:</strong> " . $conexion->connect_error . "</div>");
    }

    // 2. Consulta a la tabla Emision
    $resultado = $conexion->query("SELECT * FROM Emision");
    if (!$resultado) {
        die("<div style='color:red; margin:20px;'><strong>Error en la consulta:</strong> " . $conexion->error . "</div>");
    }

    // 3. Crear XML
 $xml = new SimpleXMLElement('<Emisiones/>'); 

    while ($fila = $resultado->fetch_assoc()) {
        $emision = $xml->addChild('Emision');
        // IMPORTANTE: El orden de addChild debe coincidir con el orden del xs:sequence en el XSD
        // Si en el XSD quitaste IDEmision, comenta la siguiente línea:
        // $emision->addChild('IDEmision', $fila['IDEmision']); 
        
        $emision->addChild('Fecha', $fila['Fecha']);    // Debe ser YYYY-MM-DD
        $emision->addChild('Hora', $fila['Hora']);      // Debe ser HH:MM:SS
        $emision->addChild('IDPelicula', $fila['IDPelicula']);
        $emision->addChild('IDSala', $fila['IDSala']);
    }

    $dom = new DOMDocument();
    $dom->preserveWhiteSpace = false;
    $dom->formatOutput = true;
    $dom->loadXML($xml->asXML());

    // 4. Validación XSD (asegúrate de que el nombre del archivo coincida en mayúsculas/minúsculas)
    echo "<div class='status-box'>";
    if (file_exists("Emisiones.xsd")) { // Ojo con la E mayúscula
        if ($dom->schemaValidate("Emisiones.xsd")) {
            echo "<span style='color:green; font-weight:bold;'>✔ XML generado y válido según XSD</span>";
        } else {
            echo "<span style='color:red; font-weight:bold;'>✖ Error de validación: Revisa el orden de los campos.</span>";
        }
    } else {
        echo "<span style='color:orange; font-weight:bold;'>⚠ No se encontró emisiones.xsd</span>";
    }
    echo "</div>";

    // 5. Transformar con XSLT
    $xslDoc = new DOMDocument();
    if ($xslDoc->load("emisiones.xslt")) {
        $proc = new XSLTProcessor();
        $proc->importStylesheet($xslDoc);
        echo "<hr/>";
        echo $proc->transformToXML($dom);
    } else {
        echo "<div style='color:red; font-weight:bold;'>✖ No se pudo cargar emisiones.xslt</div>";
    }

    $conexion->close();

} else {
    // Mensaje inicial antes de procesar
    echo "<div class='mensaje-inicio'><p>El sistema de emisiones está listo. Pulsa el botón para sincronizar.</p></div>";
}
?>

</body>
</html>