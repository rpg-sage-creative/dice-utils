export function cleanSigns(value) {
    return value.replace(/[+-](\s*[+-])+/g, match => {
        const signs = match.replace(/\s/g, "");
        let positive = true;
        ([...signs]).forEach(sign => positive = sign === "-" ? !positive : positive);
        return positive ? "+" : "-";
    });
}
