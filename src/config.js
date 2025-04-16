export const API_URL = "http://localhost:8181";

// Force mock API for GitHub Pages deployment 
// In production deployment, this should always be true since the backend server won't be available
export const USE_MOCK_API = true;

// Enable or disable server status notifications - set to false by default
export const SHOW_SERVER_STATUS = false;

// Helper function to toggle mock API mode
export const setMockApiMode = (useMock) => {
    localStorage.setItem('USE_MOCK_API', useMock);
    // Reload page to apply changes
    window.location.reload();
};

// Helper function to detect if server is available
export const checkServerAvailability = async () => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${API_URL}/`, {
            method: 'GET',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        return response.ok;
    } catch (error) {
        console.error('Server check failed:', error);
        return false;
    }
};
