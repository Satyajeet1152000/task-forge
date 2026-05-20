const timeAgo = (date: Date): string => {
    const seconds = Math.floor(
        (new Date().getTime() - new Date(date).getTime()) / 1000
    );

    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + " year";
    }

    interval = seconds / 604800;
    if (interval > 1) {
        return Math.floor(interval) + " week";
    }

    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }

    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hr";
    }

    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " min";
    }

    return Math.floor(seconds) + " sec";
};

export default timeAgo;
