const isIncomeVisibleNow = () => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        hour12: false
    });
    const istHour = parseInt(formatter.format(now), 10);
    
    // Hidden if created between 12 PM (12) and 11:59 PM (23)
    // Visible otherwise (0 to 11)
    if (istHour >= 12 && istHour <= 23) {
        return false;
    }
    return true;
};

module.exports = { isIncomeVisibleNow };
