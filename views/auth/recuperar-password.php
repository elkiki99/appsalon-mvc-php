<h1 class="nombre-pagina">Reescribir Password</h1>
<p class="descripcion-pagina">Ingresa tu password nuevo</p>

<?php
    include_once __DIR__ . "/../templates/alertas.php";
?>

<?php if($error) return; ?>

<form class="formulario" method="POST">
    <div class="campo">
        <label for="password">Password</label>
        <input 
            type="password"
            id="password"
            placeholder="Tu Nuevo Password"
            name="password"
        />
    </div>

    <input type="submit" class="boton" value="Guardar nuevo password">

    <div class="acciones">
        <a href="/">¿Ya tienes una cuenta? Inicia sesión</a>
        <a href="/crear-cuenta">¿Aún no tienes cuenta? Crear una</a>
    </div>
</form>