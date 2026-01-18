// Vérification de la connexion au serveur
async function checkServerHealth() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('✅ Serveur actif:', data);
        return true;
    } catch (error) {
        console.error('❌ Erreur de connexion au serveur:', error);
        showNotification('Erreur de connexion au serveur', 'error');
        return false;
    }
}

// Affichage de notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 600;
    `;
    
    if (type === 'success') {
        notification.style.background = '#10b981';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.background = '#ef4444';
        notification.style.color = 'white';
    } else {
        notification.style.background = '#3b82f6';
        notification.style.color = 'white';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Vérification de la disponibilité des modules
async function checkModulesAvailability() {
    const modules = ['distribution', 'plans', 'devoirs'];
    const results = {};
    
    for (const module of modules) {
        try {
            const response = await fetch(`/api/${module}/health`);
            results[module] = response.ok;
        } catch (error) {
            results[module] = false;
        }
    }
    
    return results;
}

// Animation au chargement
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Système Scolaire Intégré - Chargement...');
    
    // Vérification du serveur
    const serverOk = await checkServerHealth();
    
    if (serverOk) {
        showNotification('Système chargé avec succès', 'success');
    }
    
    // Animation des cartes au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.module-card, .sync-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
});

// Gestion des liens des modules
document.querySelectorAll('.module-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const moduleName = e.currentTarget.closest('.module-card').classList[1];
        console.log(`📱 Navigation vers le module: ${moduleName}`);
    });
});

// Ajout d'un style pour les animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
