export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.error('This browser does not support desktop notification');
        return;
    }

    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        await Notification.requestPermission();
    }
};

export const showNotification = (title: string, options: NotificationOptions) => {
    if (!('Notification' in window)) {
        return;
    }

    if (Notification.permission === 'granted') {
        new Notification(title, options);
    }
};
