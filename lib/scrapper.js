import axios from "axios";
import cheerio from "cheerio";
import config from "../config.js";
import { logger } from "../utils/log.js";
import { decode, decrypt, encode, encrypt } from "../utils/cipher.js";
import { extractIdAndDomainFromUrl } from "../utils/extractor.js";

const baseUrl = config.DRAMA.DOMAIN;

class Scraper {
    constructor() {
        this.baseUrl = baseUrl;
    }

    // Method to make a GET request to the specified URL
    async fetchData(url) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            logger.error("Error fetching data");
            throw new Error("Error fetching data");
        }
    }

    // Method to scrape popular shows
    async scrapePopularShows(page = 1) {
        try {
            const html = await this.fetchData(`${this.baseUrl}/most-popular-drama?page=${page}`);
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

            const total = $(".pagination .last > a").attr("href").split("=")[1];

            const pageInfo = {
                current: parseInt(page),
                total: parseInt(total)
            }

            return { page: pageInfo, data: shows };
        } catch (error) {
            logger.error("Error scraping popular shows");
            throw new Error("Error scraping popular shows");
        }
    }

    // Method to scrape show by ID
    async scrapeShowById(id) {
        try {
            id = decode(id);
            const html = await this.fetchData(`${this.baseUrl}/drama-detail/${id}`);
            const $ = cheerio.load(html);

            const title = $(".details .info h1").text();
            const info = $(".details .info p");
            const description = info.eq(3).text();
            const totalEpisodes = info.eq(5)?.text()?.split(" ")[1];
            const duration = info.eq(6)?.text()?.split(" ")[1];
            const airsOn = info.eq(7)?.text();
            const country = info.eq(12).find("a").text();
            const status = info.eq(13).find("a").text();
            const year = info.eq(14).find("a").text();

            const genres = [];

            info.eq(15).find("a").each((index, element) => {
                const ele = $(element);
                const genre = ele.text();
                genres.push(genre);
            });

            const otherNames = [];

            $(".details .other_name > a").each((index, element) => {
                const ele = $(element);
                const name = ele.text().trim();
                otherNames.push(name);
            });

            const episodes = [];

            $(".all-episode > li").each((index, element) => {
                const ele = $(element);
                const episode = ele.find("a h3")?.text()?.trim()?.split(") ")[1];
                const id = encode(ele.find("a").attr("href"));
                const time = ele.find(".time").text();
                const type = ele.find(".type").text();
                episodes.push({ episode, id, time, type });
            });

            return { title, description, episodes, totalEpisodes, duration, airsOn, country, status, year, genres, otherNames };;
        } catch (error) {
            logger.error(`Error scraping show: ${id}`);
            throw new Error(`Error scraping show: ${id}`);
        }
    }

    async getPlayableUrl(domain, id) {
        try {
            const encId = encrypt(id);
            const response = await axios.get(`https://${domain}/encrypt-ajax.php?id=${encId}`);
            const { data } = response.data;
            const payload = decrypt(data);
            const jsonPayload = JSON.parse(payload);
            if (jsonPayload.source.length > 0) {
                return jsonPayload.source[0].file;
            }
            return null;
        } catch (error) {
            console.log(error)
            logger.error(`Error scraping playable URL: ${id}`);
            throw new Error(`Error scraping playable URL: ${id}`);
        }
    }

    // Method to scrape episode by ID for a specific show
    async scrapeEpisodeById(episodeId) {
        try {
            episodeId = decode(episodeId);
            const html = await this.fetchData(`${this.baseUrl}${episodeId}`);
            const $ = cheerio.load(html);

            const playableUrl = $("iframe").attr("src");
            const { id, domain } = extractIdAndDomainFromUrl(playableUrl);

            const data = await this.getPlayableUrl(domain, id);
            return { url: data };
        } catch (error) {
            logger.error(`Error scraping episode: ${episodeId}`);
            throw new Error(`Error scraping episode: ${episodeId}`);
        }
    }
}

export default Scraper;
