import * as service from "../services/shows.js";

export const handleGetAllShows = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const shows = await service.getAllShows(page);
        res.send(shows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const handleGetShowById = async (req, res) => {
    try {
        const id = req.params.id;
        const show = await service.getShowById(id);
        res.send(show);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const handleGetEpisodeById = async (req, res) => {
    try {
        const id = req.params.id;
        if(!id || id === "") throw Error("Missing required parameter");
        const show = await service.getEpisodeById(id);
        res.send(show);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}