export function hasSecretFlag(description) {
    return /secret/i.test(description ?? "");
}
