import { format } from 'date-fns';

export function formatDate(date) {
    return format(new Date(date), 'dd/MM/yyyy');
}

export function formatDateTime(date) {
    return format(new Date(date), 'dd.MM.yyyy - HH:mm');
}

// export function fDateTimeSuffix(date) {
//     return format(new Date(date), 'dd/MM/yyyy hh:mm p');
// }

// export function fToNow(date) {
//     return formatDistanceToNow(new Date(date), {
//         addSuffix: true,
//     });
// }
