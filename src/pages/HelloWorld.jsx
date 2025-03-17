import { useContext, useState } from 'preact/hooks'
import { AppState } from '../state.js'
import * as api from '../api.jsx'
import * as Icons from '../assets/icons.jsx'

const SimpleProcessList = () => { // Komponente für die Anzeige der Prozessliste
    const state = useContext(AppState); // Holt den globalen Zustand (AppState) mit der useContext-Hook
    const [showProcesses, setShowProcesses] = useState(false); // State für die Anzeige der Prozessliste (Standard: false)
    const [processList, setProcessList] = useState([]); // State für die Prozessliste (Standard: leeres Array)
    const [searchTerm, setSearchTerm] = useState(''); // State für den Suchbegriff (Standard: leer)
  
    const handleButtonClick = async () => { // Funktion, die beim Klick auf den Button ausgeführt wird
      setShowProcesses(!showProcesses); // Toggle der Anzeige der Prozessliste
      if (!showProcesses) { // Wenn Prozesse noch nicht angezeigt werden, hole sie
        const processes = await api.get_process_definitions(state); // API-Aufruf, um Prozessdefinitionen zu erhalten
        setProcessList(processes?.data || []); // Setze die Prozessliste mit den erhaltenen Daten
      }
    };
  
    const filteredProcesses = processList.filter(process => { // Filtert die Prozesse basierend auf dem Suchbegriff
      const processName = process.definition?.name || ""; // Holt den Namen des Prozesses, falls vorhanden
      return processName.toLowerCase().includes(searchTerm.toLowerCase()); // Vergleicht den Namen mit dem Suchbegriff (case-insensitive)
    });

  return (
    <div>
      <button id="startButton" onClick={handleButtonClick} >
        <Icons.play/> 
        {showProcesses ? "Hide processes" : "Start process"}
      </button>

      {showProcesses && (
        <>
          <style>
            {`

                #startButton{

                }
            

              .popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.3);
                z-index: 999;
                display: flex;
                justify-content: center;
                align-items: center;
              }

              .popup {
                background: white;
                border-radius: 4px;
                width: 800px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                display: flex;
                flex-direction: column;
              }

              .popup-header {
                padding: 20px;
                background: #f9f9f9;
                border-bottom: 1px solid #eee;
                display: flex;
                flex-direction: column;
                position: relative;
              }

              .popup-title {
                font-size: 18px;
                font-weight: normal;
                margin: 0 0 15px 0;
              }

              .search-input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 3px;
                font-size: 14px;
              }

              .process-list {
                padding: 0;
                margin: 0;
                list-style: none;
              }

              .process-item {
                padding: 12px 20px;
                border-bottom: 1px solid #eee;
                color: #0066cc;
                cursor: pointer;
              }

              .process-item:hover {
                background-color: #f5f5f5;
              }

              .popup-info {
                padding: 12px 20px;
                color: #666;
                font-size: 13px;
                display: flex;
                align-items: center;
              }

              .popup-info:before {
                content: "ℹ";
                margin-right: 8px;
                font-size: 16px;
              }

              .close-btn {
                position: absolute;
                right: 20px;
                top: 20px;
                background: transparent;
                border: none;
                color: #0066cc;
                cursor: pointer;
                font-size: 14px;
              }

              .popup-footer {
                padding: 15px 20px;
                text-align: right;
                background: #f9f9f9;
                border-top: 1px solid #eee;
              }
            `}
          </style>
          <div class="popup-overlay">
            <div class="popup">
              <div class="popup-header">
                <h2 class="popup-title">Start process</h2>
                <button class="close-btn" onClick={() => setShowProcesses(false)}>
                  Close
                </button>
                <input 
                  type="text" 
                  class="search-input" 
                  placeholder="Search by process name." 
                  value={searchTerm}
                  onInput={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div class="popup-info">
                Click on the process to start.
              </div>
              
              <ul class="process-list">
                {filteredProcesses.map((process, index) => ( //Filter damit nur name und key angezeigt werden
                    <li key={index} class="process-item">
                        {process.definition?.name + " / Key: "}
                        {process.definition?.key}
                    </li>
                ))}
              </ul>
              
              <div class="popup-footer">
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export { SimpleProcessList };