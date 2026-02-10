<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Peliculas Destacadas - Exportación</title>
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

        .btn-exportar:active {
            transform: translateY(-1px);
        }

        .btn-exportar span {
            font-size: 20px;
        }

        /* Contenedor de mensajes de estado */
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
            font-family: "Arial", sans-serif; 
        
        }

        hr { border: 0; border-top: 1px solid #ddd; margin: 40px 0; }
    
        table { margin-top: 20px !important; }
    </style>
</head>
<body>

<div class="header-section">
    <h1>Exportar Base de Datos a XML</h1>
    <form method="post">
        <button type="submit" name="exportar" class="btn-exportar">
           GENERAR LISTADO DE PELÍCULAS
        </button>
    </form>
</div>

<?php
if (isset($_POST['exportar'])) {

    // 1. Conexión a MySQL

    $conexion = new mysqli("host.docker.internal", "root", "1DAW3_BBDD", "CineDB");

    if ($conexion->connect_error) {
        echo "<div class='status-box' style='border-color: red;'>";
        die("<p style='color:red'><strong>Error de conexión:</strong> " . $conexion->connect_error . "</p></div>");
    }

    $resultado = $conexion->query("SELECT * FROM Pelicula");

    if (!$resultado) {
        echo "<div class='status-box' style='border-color: red;'>";
        die("<p style='color:red'><strong>Error en la consulta:</strong> " . $conexion->error . "</p></div>");
    }

    // 2. Crear XML
    $xml = new SimpleXMLElement('<peliculas/>');

    while ($fila = $resultado->fetch_assoc()) {
        $pelicula = $xml->addChild('pelicula');
        $pelicula->addChild('IDPelicula', $fila['IDPelicula']);
        $pelicula->addChild('Titulo', $fila['Titulo']);
        $pelicula->addChild('Sinopsis', $fila['Sinopsis']);
        $pelicula->addChild('Director', $fila['Director']);
        $pelicula->addChild('Duracion', $fila['Duracion']);
        $pelicula->addChild('Genero', $fila['Genero']);
        $pelicula->addChild('AñoLanzamiento', $fila['AñoLanzamiento']);
        $pelicula->addChild('Pais', $fila['Pais']);
    }

    // 3. Validar con XSD y mostrar estado
    $dom = new DOMDocument();
    $dom->loadXML($xml->asXML());

    echo "<div class='status-box'>";
    echo "<strong>Estado de la exportación:</strong><br>";
    if ($dom->schemaValidate("peliculas.xsd")) {
        echo "<span style='color:green'>✔ XML generado y válido según XSD</span>";
    } else {
        echo "<span style='color:red'>✖ XML generado pero NO es válido según XSD</span>";
    }
    echo "</div>";

    // 4. Transformar con XSLT y mostrar la tabla 
    $xslDoc = new DOMDocument();
    if ($xslDoc->load("peliculas.xslt")) {
        $proc = new XSLTProcessor();
        $proc->importStylesheet($xslDoc);
        
        echo "<hr/>";
        // Aquí se imprime la tabla generada por el XSLT
        echo $proc->transformToXML($dom);
    } else {
        echo "<div class='status-box' style='border-color: red;'>";
        echo "<p style='color:red'>✖ Error: No se pudo cargar el archivo peliculas.xslt</p></div>";
    }

    $conexion->close();

} else {
    // Esto se muestra antes de pulsar el botón
    echo "<div class='mensaje-inicio'><p>El sistema está listo. Pulsa el botón superior para sincronizar con la base de datos.</p></div>";
}
?>

</body>
</html>