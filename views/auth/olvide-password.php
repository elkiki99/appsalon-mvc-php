<h1 class="nombre-pagina">Olvide Password</h1>
<p class="descripcion-pagina">Restablecer tu password escribiendo tu email a continuación</p>

<?php
    include_once __DIR__ . "/../templates/alertas.php";
?>

<form action="/olvide-password" class="formulario" method="POST">
    <div class="campo">
        <label for="email">E-mail</label>
        <input
            type="text" 
            id="email" 
            name="email" 
            placeholder="Tu E-mail"
        />
    </div>

    <input type="submit" value="Enviar Instrucciones" class="boton">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia sesión</a>
    <a href="/crear-cuenta">¿Aún no tienes cuenta? Crear una</a>
</div>