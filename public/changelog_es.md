### 1.5.1 - 25 Diciembre 2022 
***

#### Nuevo
 * Nueva pestaña Conexiones en Configuración->General, con integración de Telegram añadida sólo para notificaciones de eventos (de momento).

#### Corregido
 * Corregida la navegación por la página al borrar el último elemento de la colección.
 * Corregido el número de página inicial al cargar elementos de colecciones con cualquier filtro.
 * Corregida la comprobación de elementos duplicados. Ahora también se comprueba por colección, por lo que puedes tener el mismo elemento en diferentes colecciones y no ser establecido como duplicado.
 * Corregida la comprobación de imágenes al importar un artículo. Ahora si la imagen procede de una URL, no va a crear una nueva imagen, en su lugar usará la existente.

### 1.5.0 - 15 Diciembre 2022 
***

#### Nuevo
 * Importación añadida GiantBomb Api
 * Añadida comprobación de Apis nuevas añadidas que faltan para el usuario logueado
 * Notificación eventos en campana de Avatar, con menu desplegable para ver los eventos. Actualmente solo los que ocurren en el día actual
 * Nueva plantilla de Videojuegos añadida a la creación de colecciones, con metadatos incorporados

#### Corregido
 * Cambiada la Lógica de la API de obtención de Feeds, ahora debería ser más rápida y flexible para múltiples RSS Feeds.
 * Arreglada la busqueda de elementos con espacio en el nombre en la API de PokemonTCG.

### 1.4.2 - 9 Diciembre 2022 
***

#### Nuevo
 * Importación añadida Star Wars Api
 * Importación añadida Gijoe Api
 * Importación añadida TMNT Api

### 1.4.1 - 8 Diciembre 2022 
***

#### Nuevo
 * Importación añadida MOTU Api
 * Comprobación de objetos duplicados antes de importar un elemento mediante Scrapper


### 1.4.0 - 2 Diciembre 2022 
***

#### Nuevo
 * Comprobador de última versión instalada o no, en Configuración->Actualizaciones y en la Barra Superior, con color rojo
 * Importación añadida DC Multiverse Api
 * Añadida ayuda a la importación de CSV

#### Corregido
 * Se ha corregido el error de parsing de la fecha de adquisicion al importar datos desde un CSV
 * Eliminado botón de siguiente cuando se finalizan todos los pasos de importación desde CSV antes de comenzar la importación
 * Cuando se borra una serie, se ponen por defecto a todos los objetos que tenían esa serie, una llamada Default
 * Cuando se borra un objeto, si no hay mas objetos con esa serie, la serie se borra también.
 * Cuando se borra un objeto, se actualiza el listado de objetos en pantalla con los nuevos datos.

### 1.3.0 - 1 Diciembre 2022 
***

#### Nuevo
 * Posibilidad de importar objetos como poseídos cuando se añaden desde una Api o Web
 * Importación añadida Hot Wheels Api
 * Importacion de metadatos cuando se importan objetos desde una Api o Web

#### Corregido
 * Se han adaptado las pantallas para las resoluciones de Tablets 
 * Añadido icono Tick o Cruz para metadatos de tipo boolean al ver elementos de colecciones


### 1.2.0 - 25 Noviembre 2022 
***

#### Nuevo
 * Importación añadida Marvel Legends Api

#### Corregido
 * Se ha corregido el error de la cadena de búsqueda vacía al importar desde una API de colecciones
 * Validación de precios en editar e insertar objeto arreglada.

### 1.1.0 - 20 Noviembre 2022 
***

#### Nuevo
 * Pantallas de Series, Imágenes, Colecciones, Apis y Panel de Control adaptadas para múltiples resoluciones.

#### Corregido
 * Búsqueda recurrente de elementos en Apis sin tener que seleccionar de nuevo una Api.


### 1.0.1 - 3 Noviembre 2022 
***

#### Corregido
 * Editar objetos con metadatos, buscar por id era un String, ahora es un Long.
 * Los campos de metadatos de tipo Boolean arreglados al editar objetos. Ahora aparecen marcados cuando el valor es 1 o true.



### 1.0.0 - 30 Octubre 2022 
***

#### Nuevo
 * CRUD Colecciones
 * CRUD Series 
 * CRUD Imagenes
 * Control de colecciones, tanto el coste como el numero de elementos poseidos
 * Importación de objetos de colección desde archivos CSV o desde plantilla de cero
 * Campos personalizados, en adición a los por defecto creados en cada colección
 * Tarjetas en el Panel de control para mostrar gastos, objetos más caros, número de colecciones, número de objetos, adquisiciones recientes, etc...
 * Visor de Feeds RSS
 * Integración de Apis para la importación de objetos (Por el momento, solo Pokemon TCG y Rebrickable)
 * Calendario para administración de eventos para lanzamientos futuros o compras
 * Creación de Temas de la aplicación