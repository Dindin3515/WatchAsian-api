# WatchAsian

A simple, self-hosted scraper for Asian dramas ([watchasia.to](https://watchasia.to)).

## Usage

### Cloning the Repository

To get started, clone the repository:

```bash
git clone https://github.com/HritikR/WatchAsian.git
cd WatchAsian
```

### Installing Dependencies

Install the required dependencies:

```bash
npm install
```

### Running the Server

Start the server with:

```bash
npm start
```

### Accessing the Endpoints

Once the server is running, you can access the following endpoints:

## Endpoints

- **`/shows`**: Retrieves a list of all shows.
- **`/shows/:id`**: Retrieves details for a specific show by its ID.
- **`/episode/:episodeId`**: Retrieves details for a specific episode by its ID.
- **`/search?keyword=query`**: Searches for shows based on a query.