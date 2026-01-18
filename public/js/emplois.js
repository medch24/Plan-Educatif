// État global
let emploiData = [];
let currentClasse = '';
let currentCell = null;
let matieres = [];
let enseignants = [];

// Jours et périodes
const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi'];
const HORAIRES = [
    { periode: 1, horaire: '8:00 - 8:45' },
    { periode: 2, horaire: '8:45 - 9:30' },
    { periode: 3, horaire: '9:30 - 10:15' },
    { periode: 'pause1', horaire: '10:15 - 10:35', nom: 'Pause 1' },
    { periode: 4, horaire: '10:35 - 11:15' },
    { periode: 5, horaire: '11:15 - 11:55' },
    { periode: 6, horaire: '11:55 - 12:35' },
    { periode: 7, horaire: '12:35 - 13:15' },
    { periode: 'pause2', horaire: '13:15 - 13:45', nom: 'Pause 2' },
    { periode: 8, horaire: '13:45 - 14:30' }
];

// Charger l'emploi du temps
async function loadEmploi() {
    const select = document.getElementById('classeSelect');
    currentClasse = select.value;
    
    if (!currentClasse) {
        document.getElementById('emploiContainer').innerHTML = `
            <p class="empty-state">
                <i class="ri-calendar-line"></i>
                Sélectionnez une classe pour afficher l'emploi du temps
            </p>
        `;
        return;
    }
    
    try {
        // Charger l'emploi
        const response = await fetch(`/api/emplois/classe/${currentClasse}`);
        const data = await response.json();
        
        if (data.success) {
            emploiData = data.data;
            displayEmploi();
            
            // Charger matières et enseignants
            await loadMatieres();
            await loadEnseignants();
            
            showNotification('Emploi du temps chargé', 'success');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur de chargement', 'error');
    }
}

// Afficher l'emploi du temps
function displayEmploi() {
    const container = document.getElementById('emploiContainer');
    
    let html = '<table class="emploi-table">';
    
    // En-tête
    html += '<thead><tr>';
    html += '<th style="width: 120px;">Horaire</th>';
    JOURS.forEach(jour => {
        html += `<th>${jour}</th>`;
    });
    html += '</tr></thead>';
    
    // Corps
    html += '<tbody>';
    HORAIRES.forEach(h => {
        html += '<tr>';
        
        // Horaire
        const isPause = typeof h.periode === 'string' && h.periode.includes('pause');
        html += `<td class="horaire-cell">${h.horaire}</td>`;
        
        // Séances pour chaque jour
        JOURS.forEach(jour => {
            const seance = emploiData.find(s => 
                s.jour === jour && s.periode == h.periode
            );
            
            if (isPause) {
                html += `<td class="pause-cell">${h.nom || 'Pause'}</td>`;
            } else if (seance) {
                const matiereText = seance.matiere || '<span class="empty-cell">Vide</span>';
                const enseignantText = seance.enseignant ? `<div class="enseignant">${seance.enseignant}</div>` : '';
                const salleText = seance.salle ? `<div class="salle">Salle ${seance.salle}</div>` : '';
                
                html += `
                    <td class="seance-cell" 
                        onclick="editSeance('${jour}', ${h.periode})"
                        data-jour="${jour}" 
                        data-periode="${h.periode}">
                        <div class="matiere">${matiereText}</div>
                        ${enseignantText}
                        ${salleText}
                    </td>
                `;
            } else {
                html += `
                    <td class="seance-cell" 
                        onclick="editSeance('${jour}', ${h.periode})"
                        data-jour="${jour}" 
                        data-periode="${h.periode}">
                        <span class="empty-cell">Cliquez pour ajouter</span>
                    </td>
                `;
            }
        });
        
        html += '</tr>';
    });
    html += '</tbody>';
    html += '</table>';
    
    container.innerHTML = html;
}

// Charger les matières
async function loadMatieres() {
    try {
        const response = await fetch(`/api/emplois/matieres/${currentClasse}`);
        const data = await response.json();
        if (data.success) {
            matieres = data.matieres;
            updateDatalist('matieresDatalist', matieres);
        }
    } catch (error) {
        console.error('Erreur chargement matières:', error);
    }
}

// Charger les enseignants
async function loadEnseignants() {
    try {
        const response = await fetch(`/api/emplois/enseignants/${currentClasse}`);
        const data = await response.json();
        if (data.success) {
            enseignants = data.enseignants;
            updateDatalist('enseignantsDatalist', enseignants);
        }
    } catch (error) {
        console.error('Erreur chargement enseignants:', error);
    }
}

// Mettre à jour les datalists
function updateDatalist(id, items) {
    const datalist = document.getElementById(id);
    datalist.innerHTML = items.map(item => `<option value="${item}">`).join('');
}

// Éditer une séance
function editSeance(jour, periode) {
    const seance = emploiData.find(s => s.jour === jour && s.periode == periode);
    
    currentCell = { jour, periode };
    
    document.getElementById('editMatiere').value = seance?.matiere || '';
    document.getElementById('editEnseignant').value = seance?.enseignant || '';
    document.getElementById('editSalle').value = seance?.salle || '';
    
    document.getElementById('editModal').style.display = 'flex';
}

// Sauvegarder l'édition
function saveEdit() {
    if (!currentCell) return;
    
    const matiere = document.getElementById('editMatiere').value;
    const enseignant = document.getElementById('editEnseignant').value;
    const salle = document.getElementById('editSalle').value;
    
    // Trouver ou créer la séance
    const index = emploiData.findIndex(s => 
        s.jour === currentCell.jour && s.periode == currentCell.periode
    );
    
    const horaire = HORAIRES.find(h => h.periode == currentCell.periode)?.horaire || '';
    
    const newSeance = {
        classe: currentClasse,
        jour: currentCell.jour,
        periode: currentCell.periode,
        horaire: horaire,
        matiere: matiere,
        enseignant: enseignant,
        salle: salle,
        type: 'cours'
    };
    
    if (index >= 0) {
        emploiData[index] = newSeance;
    } else {
        emploiData.push(newSeance);
    }
    
    displayEmploi();
    closeModal();
    showNotification('Séance modifiée (non sauvegardée)', 'success');
}

// Fermer la modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    currentCell = null;
}

// Sauvegarder l'emploi
async function saveEmploi() {
    if (!currentClasse) {
        showNotification('Sélectionnez une classe', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/emplois/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                classe: currentClasse,
                emploi: emploiData
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Emploi du temps sauvegardé', 'success');
        } else {
            showNotification(data.message || 'Erreur de sauvegarde', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur de sauvegarde', 'error');
    }
}

// Réinitialiser
async function resetEmploi() {
    if (!currentClasse) return;
    
    if (confirm('Réinitialiser l\'emploi du temps par défaut ?')) {
        await loadEmploi();
    }
}

// Exporter Excel
function exportExcel() {
    if (!currentClasse) {
        showNotification('Sélectionnez une classe', 'error');
        return;
    }
    
    // Préparer les données
    const data = [['Horaire', ...JOURS]];
    
    HORAIRES.forEach(h => {
        const row = [h.horaire];
        
        JOURS.forEach(jour => {
            const seance = emploiData.find(s => 
                s.jour === jour && s.periode == h.periode
            );
            
            if (typeof h.periode === 'string' && h.periode.includes('pause')) {
                row.push(h.nom || 'Pause');
            } else if (seance && seance.matiere) {
                row.push(`${seance.matiere}\n${seance.enseignant || ''}`);
            } else {
                row.push('');
            }
        });
        
        data.push(row);
    });
    
    // Créer le fichier Excel
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Emploi du Temps');
    
    XLSX.writeFile(wb, `Emploi_${currentClasse}_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    showNotification('Fichier Excel téléchargé', 'success');
}

// Imprimer
function printEmploi() {
    if (!currentClasse) {
        showNotification('Sélectionnez une classe', 'error');
        return;
    }
    
    window.print();
}

// Afficher une notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Fermer la modal en cliquant en dehors
document.addEventListener('click', (e) => {
    const modal = document.getElementById('editModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    console.log('Module Emplois du Temps chargé');
});
