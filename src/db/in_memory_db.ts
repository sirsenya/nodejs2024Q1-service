import { User } from 'src/user/entities/user.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';

const now = Date.now();

export const users: User[] = [
  new User({
    id: 'f188e7c4-32fd-45f8-bfaa-018e6a9fec02',
    login: 'login',
    password: 'password',
    version: 1,
    createdAt: now,
    updatedAt: now,
  }),
];

export const artists: Artist[] = [
  new Artist({
    id: 'f188e7c4-32fd-45f8-bfaa-018e6a9fec01',
    name: 'Sereny Steph',
    grammy: true,
  }),
];
export const albums: Album[] = [
  new Album({
    id: 'f188e7c4-32fd-45f8-bfaa-018e6a9fec01',
    name: 'First',
    year: 2024,
  }),
];
