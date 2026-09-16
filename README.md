# Guía de Personalización y Publicación del Recurso Digital
## Curso: Infancias: Historias y Perspectivas (Código 514517)
### Escuela de Ciencias de la Educación (ECEDU) &mdash; Universidad Nacional Abierta y a Distancia (UNAD)

Este repositorio contiene el recurso digital educativo interactivo desarrollado para el **Reto 2: Construcción histórica de las infancias**, diseñado bajo altos estándares de diseño académico, accesibilidad web y compatibilidad responsive (móvil, tablet y escritorio).

---

## 1. Estructura del Proyecto

El recurso es completamente autónomo y no requiere dependencias pesadas, compiladores ni servidores complejos. Se compone de cuatro archivos principales:

```
unad-infancias-web/
├── index.html        # Estructura semántica completa, navegación, contenidos del Reto 2 y pestañas futuras
├── styles.css        # Sistema de diseño con paleta institucional UNAD, diseño responsive y tipografía
├── app.js            # Lógica de navegación SPA por hash, interactividad de línea de tiempo y acordeones
└── README.md         # Manual de personalización y despliegue para el equipo colaborativo
```

---

## 2. Cómo Visualizar el Proyecto Localmente

Para revisar y probar el recurso en su computadora antes de publicarlo:

### Opción 1: Apertura directa en el navegador
1. Abra el explorador de archivos y navegue hasta la carpeta `unad-infancias-web`.
2. Haga doble clic sobre el archivo `index.html`.
3. El proyecto se abrirá inmediatamente en su navegador web predeterminado (Chrome, Edge, Firefox, Safari).

### Opción 2: Mediante Visual Studio Code (Live Server)
1. Abra la carpeta `unad-infancias-web` en VS Code.
2. Si tiene instalada la extensión **Live Server**, haga clic derecho sobre `index.html` y seleccione **Open with Live Server**.
3. El sitio se ejecutará en una dirección local como `http://127.0.0.1:5500/index.html`.

---

## 3. Guía de Personalización para el Grupo Colaborativo

Todos los textos son fácilmente editables abriendo el archivo `index.html` con cualquier editor de texto o código (VS Code, Bloc de notas, Notepad++):

### A. Datos de los Integrantes del Equipo
Busque en `index.html` la sección `<section class="section team-section">` (aproximadamente línea 230). Encontrará las 5 tarjetas con los roles estipulados en la guía de la UNAD:

1. **Líder:** Reemplace `"Integrante 1 (Líder)"` y `"Código: Estudiante UNAD"` con el nombre real y documento/código del compañero responsable.
2. **Compilador:** Reemplace los datos de `"Integrante 2 (Compilador)"`.
3. **Revisor:** Reemplace los datos de `"Integrante 3 (Revisor)"`.
4. **Evaluador:** Reemplace los datos de `"Integrante 4 (Evaluador)"`.
5. **Entregas:** Reemplace los datos de `"Integrante 5 (Entregas)"`.

*Nota:* No olvide actualizar también los nombres en el pie de página (`site-footer`) en la sección `footer-team-roles`.

### B. Textos de la Reflexión Crítica
En la pestaña del Reto 2, localice la sección `<section class="section reflection-section" id="reflexion-critica">`. 
Allí se encuentran estructurados los tres ejes nodales de análisis:

- **Eje 1:** Perdurabilidad del adultocentrismo en las prácticas pedagógicas y familiares.
- **Eje 2:** Tensión entre disciplina punitiva, castigo físico y crianza respetuosa (Ley 2089 de 2021).
- **Eje 3:** Pedagogía de las infancias situadas desde la perspectiva territorial y comunitaria de la UNAD.

El recurso ya incluye una sustentación teórica sólida. Si el grupo acordó conclusiones específicas adicionales en el foro de aprendizaje colaborativo, pueden editar o ampliar los párrafos contenidos en `<div class="reflection-card-body">`.

### C. Referencias Bibliográficas Adicionales
En la pestaña de referencias (`#tab-referencias`), bajo el contenedor `references-custom-box`, el equipo puede agregar cualquier artículo de revista indexada (Scielo, Redalyc, Dialnet) o documento complementario de la unidad, siguiendo la sangría francesa ya preconfigurada (`apa-item`):

```html
<p class="apa-item">
  Apellido, A. A., y Apellido, B. B. (Año). Título del artículo científico. <em>Nombre de la Revista</em>, <em>volumen</em>(número), páginas. https://doi.org/xxxx
</p>
```

---

## 4. Publicación Gratuita en la Nube (Generación del Enlace Público)

Para entregar el producto en el Entorno de Evaluación de la UNAD, se requiere un enlace web accesible públicamente que no exija credenciales de acceso ni inicio de sesión. A continuación se presentan tres alternativas gratuitas y de despliegue inmediato:

### Opción A: GitHub Pages (Recomendada)
1. Inicie sesión en [GitHub](https://github.com/) (o cree una cuenta gratuita si no dispone de una).
2. Haga clic en **New repository** (Nuevo repositorio).
3. Asigne un nombre al repositorio (por ejemplo: `unad-infancias-reto2`).
4. Seleccione la opción **Public** (Público) y marque la casilla para no inicializar con archivos adicionales.
5. En la pantalla del repositorio creado, haga clic en **Upload an existing file** (Subir archivos existentes).
6. Arrastre los 4 archivos (`index.html`, `styles.css`, `app.js`, `README.md`) y pulse **Commit changes**.
7. Ingrese a la pestaña **Settings** (Configuración) del repositorio.
8. En el menú lateral izquierdo, seleccione **Pages**.
9. En la sección **Build and deployment**, bajo **Branch**, elija la rama `main` (o `master`), deje la carpeta en `/ (root)` y haga clic en **Save**.
10. Transcurridos 1 o 2 minutos, GitHub generará su enlace público con la estructura:
    `https://[su-usuario].github.io/unad-infancias-reto2/`
11. Verifique que el enlace cargue correctamente en una pestaña de incógnito.

### Opción B: Netlify Drop (Despliegue sin comandos ni repositorio)
1. Ingrese a [Netlify Drop](https://app.netlify.com/drop).
2. Si le solicita registro, puede ingresar rápidamente con su cuenta de Google o GitHub.
3. Arrastre la carpeta completa `unad-infancias-web` a la zona de carga de la página.
4. En menos de 30 segundos, Netlify publicará el sitio y le suministrará una URL pública segura (ejemplo: `https://infancias-unad-reto2.netlify.app`).
5. Puede personalizar el subdominio en **Site configuration** &gt; **Change site name**.

### Opción C: Vercel
1. Ingrese a [Vercel](https://vercel.com/) y regístrese con su cuenta de GitHub.
2. Seleccione **Add New...** &gt; **Project**.
3. Importe el repositorio donde subió los archivos.
4. Deje la configuración por defecto y pulse **Deploy**.
5. Obtendrá una URL permanente terminada en `.vercel.app`.

---

## 5. Lista de Chequeo Previa a la Entrega Oficial

Antes de radicar el enlace final en el entorno de evaluación, verifique:

- [ ] Todos los nombres y roles de los integrantes del grupo han sido completados.
- [ ] La navegación entre las pestañas (Inicio, Reto 2, Reto 3, Reto 4, Reto 5, Referencias) funciona fluidamente.
- [ ] La línea de tiempo interactiva permite conmutar entre Edad Antigua, Edad Media y Edad Moderna sin fallos.
- [ ] Las sub-pestañas de cada periodo (Social, Cultural, Concepción, Autores, Hitos) despliegan su respectivo contenido.
- [ ] El menú hamburguesa abre y cierra correctamente en dispositivos móviles o ventanas reducidas.
- [ ] El enlace web generado en GitHub Pages, Netlify o Vercel fue probado en modo incógnito o desde un teléfono móvil, confirmando que carga sin requerir contraseña.

---

**Escuela de Ciencias de la Educación &mdash; ECEDU**  
**Licenciatura en Pedagogía Infantil**  
**Universidad Nacional Abierta y a Distancia &mdash; UNAD**  
Año 2026
