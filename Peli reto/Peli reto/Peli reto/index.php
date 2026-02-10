<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Peliculas destacadas</title>
    <style>
        body { font-family: "arial", sans-serif; padding: 20px; }
        .mensaje-inicio { text-align: center; color: #666; margin-top: 50px; }
    </style>
</head>
<body>

<h1>Exportar películas</h1>

<form method="post">
    <button type="submit" name="exportar">
        Exportar películas
    </button>
</form>

<?php
if (isset($_POST['exportar'])) {

    // Conexión a MySQL
    $conexion = new mysqli("host.docker.internal", "root", "1DAW3_BBDD", "CineDB");

    if ($conexion->connect_error) {
        die("<p style='color:red'>Error de conexión: " . $conexion->connect_error . "</p>");
    }

    $resultado = $conexion->query("SELECT * FROM Pelicula");

    if (!$resultado) {
        die("<p style='color:red'>Error en la consulta: " . $conexion->error . "</p>");
    }

    // Crear XML
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

    // Validar con XSD
    $dom = new DOMDocument();
    $dom->loadXML($xml->asXML());

    echo "<h3>Estado de la exportación:</h3>";
    if ($dom->schemaValidate("peliculas.xsd")) {
        echo "<p style='color:green'>✔ XML generado y válido según XSD</p>";
    } else {
        echo "<p style='color:red'>✖ XML generado pero NO es válido según XSD</p>";
    }

    // Transformar y MOSTRAR la tabla 
    $xslDoc = new DOMDocument();
    if ($xslDoc->load("peliculas.xslt")) {
        $proc = new XSLTProcessor();
        $proc->importStylesheet($xslDoc);
        
        echo "<hr/>";
        
        echo $proc->transformToXML($dom);
    } else {
        echo "<p style='color:red'>✖ Error: No se pudo cargar el archivo peliculas.xslt</p>";
    }

} else {
    // Esto se muestra antes de pulsar el botón
    echo "<div class='mensaje-inicio'><p>Pulsa el botón superior para cargar las peliculas.</p></div>";
}
?>

</body>
</html>
