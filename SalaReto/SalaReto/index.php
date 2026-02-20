<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Salas - Exportación XML</title>

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
        }

        .btn-exportar:hover {
            background-color: #333;
            transform: translateY(-3px);
        }

        .status-box {
            max-width: 800px;
            margin: 20px auto;
            padding: 15px;
            background: white;
            border-radius: 8px;
            border-left: 5px solid #000;
        }

        hr { border: 0; border-top: 1px solid #ddd; margin: 40px 0; }
    </style>
</head>
<body>

<div class="header-section">
    <h1>Exportar Salas a XML</h1>
    <form method="post">
        <button type="submit" name="exportar" class="btn-exportar">
            GENERAR LISTADO DE SALAS
        </button>
    </form>
</div>

<?php
if (isset($_POST['exportar'])) {

$conexion = new mysqli("db_sala", "root", "1DAW3_BBDD", "CineDB");

    if ($conexion->connect_error) {
        die("<div class='status-box' style='border-color:red;'>
                Error de conexión: {$conexion->connect_error}
             </div>");
    }

    $resultado = $conexion->query("SELECT * FROM Sala");

    if (!$resultado) {
        die("<div class='status-box' style='border-color:red;'>
                Error en la consulta: {$conexion->error}
             </div>");
    }

    // Crear XML مطابق لـ XSD
    $xml = new SimpleXMLElement('<Salas/>');

    while ($fila = $resultado->fetch_assoc()) {
        $sala = $xml->addChild('Sala');
        $sala->addChild('Nombre', $fila['Nombre']);
        $sala->addChild('Capacidad', $fila['Capacidad']);
    }

    // Validación XSD
    $dom = new DOMDocument();
    $dom->loadXML($xml->asXML());

    echo "<div class='status-box'>";
    if ($dom->schemaValidate("Sala.xsd")) {
        echo "<span style='color:green'>✔ XML válido según Sala.xsd</span>";
    } else {
        echo "<span style='color:red'>✖ XML NO válido</span>";
    }
    echo "</div>";

    // Transformación XSLT
    $xslDoc = new DOMDocument();
    if ($xslDoc->load("Sala.xslt")) {
        $proc = new XSLTProcessor();
        $proc->importStylesheet($xslDoc);

        echo "<hr/>";
        echo $proc->transformToXML($dom);
    } else {
        echo "<div class='status-box' style='border-color:red;'>
                No se pudo cargar Sala.xslt
              </div>";
    }

    $conexion->close();
}
?>

</body>
</html>