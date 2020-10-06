import {NotificationContainer, NotificationManager} from 'react-notifications';

export function showNotification(message, type="info", title = "Info!"){
    if (type === "warning" || type === "danger")
        title = 'Ups!';
    switch (type) {
        case 'info':
            NotificationManager.info(message, title);
            break;
        case 'success':
            NotificationManager.success(message, title);
            break;
        case 'warning':
            NotificationManager.warning(message, title, 3000);
            break;
        case 'danger':
            NotificationManager.error(message, title, 5000, () => {
                alert('callback');
            });
            break;
        default :
    }
}