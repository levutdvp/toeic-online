import { faker } from "@faker-js/faker/locale/en";

export const mockSongsData = (length: number) => {
  const createRowData = () => {
    return {
      name: faker.music.songName(),
      description: faker.lorem.words(6),
      genre: faker.music.genre(),
      link: "/edit-form",
    };
  };

  return Array.from({ length }).map(() => {
    return createRowData();
  });
};
