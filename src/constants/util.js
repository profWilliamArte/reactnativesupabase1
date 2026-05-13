/**
 * Utilidades globales para el proyecto
 */

/**
 * Formatea un número a moneda local ($1.234,56)
 * @param amount Número a formatear
 * @returns String formateado
 */
export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '$0,00';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '$0,00';

    return '$' + num
        .toFixed(2)
        .replace('.', ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/**
 * Formatea una fecha a DD/MM/AAAA
 * @param date Fecha o string ISO
 * @returns Fecha formateada (ej: 13/05/2026)
 */
export const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * Formatea fecha con hora DD/MM/AAAA HH:MM
 * @param date Fecha o string ISO
 * @returns Fecha y hora formateada (ej: 13/05/2026 14:30)
 */
export const formatDateTime = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const formattedDate = formatDate(d);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${formattedDate} ${hours}:${minutes}`;
};

/**
 * Retorna un tiempo relativo amigable
 * @param date Fecha o string ISO
 * @returns String relativo (ej: "Hace 5 min", "Hace 2 horas", "Ayer")
 */
export const getRelativeTime = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return 'Ahora mismo';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return formatDate(d);
};

/**
 * Trunca un texto a un máximo de caracteres
 * @param text Texto a truncar
 * @param maxLength Máximo de caracteres (default 50)
 * @returns Texto truncado con "..." si excede
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + '...';
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param text Texto a capitalizar
 * @returns Texto capitalizado
 */
export const capitalize = (text: string): string => {
    return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Obtiene un saludo según la hora del día
 * @returns Saludo (Buenos días, Buenas tardes, Buenas noches)
 */
export const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
};
