# Cinema Project

A full-stack cinema booking app built with Next.js 16, React 19, Prisma, and PostgreSQL. Users can browse movies, view projections, pick seats, book tickets, and manage favorites. Admins manage halls, projections, and bookings. Movie metadata comes from TMDB.

Styling is done with SCSS modules. Authentication uses JWT (`jsonwebtoken`) with `bcryptjs` for password hashing. The database runs in Docker.

## Running the project

`.env` is needed in the project root with `DATABASE_URL`, `JWT_SECRET`, and `TMDB_TOKEN` set. Then run:

```bash
docker compose up -d
npm install
npx prisma db push
npx prisma generate
npm run dev
```

The app will be available at http://localhost:3000. The Postgres container listens on port 5432 with user `cinema_user` / password `cinema_pass` / db `cinema_db`.

## Functionality

### User

- **Authentication** — register, login, logout; JWT stored in an HTTP-only cookie, with a `/api/auth/me` session endpoint and middleware protection for private routes.
- **Role-based access** — `USER` and `ADMIN` roles. Admin area is restricted to users with `USER` role.
- **Homepage** — hero carousel, "Now in Cinemas" carousel, and upcoming movies section.
- **Movie browsing** — movie listing page with filters (Popular, Top Rated, Now Playing, Upcoming), search and a dedicated movie details page.
- **Projections** — view available showtimes per movie, including hall and price.
- **Seat picking & booking** — interactive seat picker that displays occupied seats in real time. Booking generates a unique ticket code.
- **Tickets** — viewable ticket component with booking details.
- **My Bookings** — tabbed view (upcoming / past) of the logged-in user's bookings, with the ability to cancel.
- **Favorites** — add/remove movies from a personal favorites list.
- **Footer & navbar** — universal navigation and footer.

### Admin

- **Admin dashboard** with a dedicated layout and navigation.
- **Halls management** — list, create, edit, and delete halls (name, total seats).
- **Projections management** — list, create, edit, and delete projections (movie, hall, start time, price) via a date/time picker and movie search.
- **Bookings overview** — view all bookings from all users across the system.
- **TMDB sync** — `/api/movies/fetch` pulls movie metadata (title, description, duration, poster/backdrop, rating, age rating, release date) from TMDB and stores it locally. Flags movies as `popular`, `top_rated`, `now_playing`, or `upcoming`.

### API

- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `GET /api/movies`, `POST /api/movies/fetch`
- `GET/POST /api/halls`, `GET/PUT/DELETE /api/halls/[id]`
- `GET/POST /api/projections`, `GET/PUT/DELETE /api/projections/[id]`
- `GET/POST /api/bookings`, `GET/DELETE /api/bookings/[id]`
- `GET /api/seats/[projectionId]`
- `GET/POST /api/favorites`, `DELETE /api/favorites/[id]`

## Database models

Defined in `prisma/schema.prisma`:

- **User** — `id`, `name`, `email` (unique), `password` (hashed), `role` (`USER` or `ADMIN`), `createdAt`. Has many `Booking` and `Favorite`.
- **Movie** — local cache of a TMDB movie. `externalId` (unique), `title`, `description`, `duration`, `genre`, `posterUrl`, `backdropUrl`, `releaseDate`, `rating`, `ageRating`, and the flags `isPopular` / `isTopRated` / `isNowPlaying` / `isUpcoming`. Has many `Projection` and `Favorite`.
- **Hall** — a cinema hall: `name` and `totalSeats`. Has many `Projection`.
- **Projection** — a scheduled showing: `movieId`, `hallId`, `startTime`, `price`. Has many `Booking`.
- **Booking** — a user's reservation of one seat: `projectionId`, `userId`, `seatNumber`, `ticketCode` (unique, generated via `cuid()`), `createdAt`.
- **Favorite** — a user's favorited movie: `userId` + `movieId`, unique as a pair.
- **Role (enum)** — `USER` or `ADMIN`.
