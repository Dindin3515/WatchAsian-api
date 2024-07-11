import cheerio from "cheerio";
import { encode } from "./cipher.js";

export const extractIdAndDomainFromUrl = (urlText) => {
    const idRegex = /[?&]id=([^&]+)/;
    const domainRegex = /\/\/([^\/]+)/;

    const idMatch = urlText.match(idRegex);
    const domainMatch = urlText.match(domainRegex);

    const id = idMatch ? idMatch[1] : null;
    const domain = domainMatch ? domainMatch[1] : null;

    return { id, domain };
}

export const extractShows = (html) => {
    const $ = cheerio.load(html);
    const shows = [];

    $(".switch-block > li").each((index, element) => {
        const ele = $(element);
        const id = encode(ele.find("a").attr("href").split("/")[2]);
        const title = ele.find("h3").text();
        const poster = ele.find("img").attr("data-original");
        const show = { id, title, poster };
        shows.push(show);
    });

    const page = $(".pagination .selected > a").text();

    const total = $(".pagination .last > a").attr("href").split("=")[1];

    const pageInfo = {
        current: parseInt(page),
        total: parseInt(total)
    }

    return { page: pageInfo, data: shows };
}