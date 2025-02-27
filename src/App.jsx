import { saveAs } from 'file-saver';
import './App.css';

async function readFile(file) {
  const reader = new FileReader();
  const fileContent = await new Promise((resolve, reject) => {
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (event) => {
      reject(event.target.error);
    };
    reader.readAsText(file);
  });
  return fileContent;
}

function App() {
  const readerFile = async (e) => {
    const files = e.target.files;

    for (let index1 = 0; index1 < files.length; index1++) {
      const file = files[index1];
      const fileContent = await readFile(file);
      const lineas = fileContent.split("\n");
      const separ = '¡';

      const datos = ['Nro Factura¡Cantidad Galon¡Operador¡Volumen Total\n'];

      let nroFactura, cantGalon, operador, volumenTotal;

      for (let i = 1; i < lineas.length; i++) {
        if (lineas[i].indexOf('DOCUMENTO DEL OPERADOR') !== -1) {
          nroFactura = obtenerCampo(lineas[i + 2], lineas[i].indexOf('DOCUMENTO DEL OPERADOR'), 100);
          operador = 'DOCUMENTO DEL OPERADOR';
        }

        if (lineas[i].indexOf('Cantidad UM') !== -1) {
          cantGalon = obtenerCampo(lineas[i + 1], lineas[i].indexOf('Cantidad UM'), 20);
        }

        if (lineas[i].indexOf('DOCUMENTO DEL PARTICIPE') !== -1) {
          nroFactura = obtenerCampo(lineas[i + 1], lineas[i].indexOf('DOCUMENTO DEL PARTICIPE'), 100);
          operador = 'DOCUMENTO DEL PARTICIPE';
        }

        if (lineas[i].indexOf('Volumen Total M3:') !== -1) {
          volumenTotal = obtenerCampo(lineas[i], lineas[i].indexOf(':') + 1, 100).trim();
        }

        if (cantGalon !== undefined) {
          datos.push(`${nroFactura}${separ}${cantGalon}${separ}${operador}\n`);
          cantGalon = undefined;
        }

        if (volumenTotal !== undefined) {
          // Actualizamos la última línea agregada con el volumenTotal
          const ultimaLinea = datos[datos.length - 1].replace(/(\r\n|\n|\r)/gm, "");
          datos[datos.length - 1] = `${ultimaLinea}${separ}${volumenTotal}\n`;
          volumenTotal = undefined;
        }
      }

      // Guardar el archivo con el mismo nombre que el original
      const nombreArchivo = file.name.replace(/\.[^/.]+$/, ""); // Elimina la extensión del archivo
      const blob = new Blob([datos], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `${nombreArchivo}_procesado.txt`);
    }
  };

  function obtenerCampo(texto, inicio, Fin) {
    let dato = '';
    dato = texto.slice(inicio, Fin + inicio).trim();
    return dato;
  }

  return (
    <div className="App">
      <div className="file-processor-container">
        <div className="header">
          <h1>Procesador de Archivos</h1>
          <p>Seleccione uno o más archivos para procesar</p>
        </div>
        
        <div className="upload-area" id="uploadArea">
          <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <p className="drag-text">Arrastre los archivos aquí o</p>
          <label htmlFor="fileInput" className="file-label">Seleccionar Archivos</label>
          <input 
            type="file" 
            id="fileInput" 
            multiple 
            onChange={readerFile} 
            className="file-input"
          />
        </div>
        
        <div className="instructions">
          <h3>Instrucciones:</h3>
          <ol>
            <li>Seleccione uno o más archivos</li>
            <li>El sistema procesará automáticamente cada archivo</li>
            <li>Se descargará un archivo de texto procesado por cada archivo seleccionado</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;