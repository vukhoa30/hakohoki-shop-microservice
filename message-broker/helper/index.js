exports.formatValue = obj => {

    try {
        return JSON.parse(obj);
    } catch (e) {
        return obj;
    }

}