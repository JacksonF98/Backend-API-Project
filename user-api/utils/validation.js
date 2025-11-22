function invalidDateCheck(date){
    if(!date) return false;
    const d = new Date(date);
    if(isNaN(d)) return true;
}

module.exports = { invalidDateCheck };