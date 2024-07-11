export const extractIdAndDomainFromUrl = (urlText) => {
    const idRegex = /[?&]id=([^&]+)/;
    const domainRegex = /\/\/([^\/]+)/;

    const idMatch = urlText.match(idRegex);
    const domainMatch = urlText.match(domainRegex);

    const id = idMatch ? idMatch[1] : null;
    const domain = domainMatch ? domainMatch[1] : null;

    return { id, domain };
}