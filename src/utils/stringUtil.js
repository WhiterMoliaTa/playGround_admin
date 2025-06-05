export function isNotBlankUtil(value) {
    if (value == undefined || value == null || value == "") {
        return false
    } else {
        return true;
    }
}