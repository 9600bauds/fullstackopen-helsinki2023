const {
  favoriteBlog,
  mostProlificAuthor,
  mostLikes,
} = require('../utils/list_helper');

describe('highest:', () => {
  const blogs = [
    {
      _id: '64a1d7ea57310b3ee2f85357',
      title: 'This Horse Knows Karate?!',
      author: 'fistkickkid22',
      url: 'www.karatehorse.com',
      likes: 91,
      __v: 0,
    },
    {
      _id: '64a1d7ea57310b3122f85357',
      title: 'Deadly Karate Donkey',
      author: 'fistkickkid22',
      url: 'www.karatedonk.com',
      likes: 117,
      __v: 0,
    },
    {
      _id: '64a1d7ea13210b3122f85357',
      title: 'Awesome Hoof Kick',
      author: 'fistkickkid22',
      url: 'www.topkicks.com/horse.mpeg',
      likes: 41,
      __v: 0,
    },
    {
      _id: '64a1d85357310b3ee2f85359',
      title: 'EXTREME FAST DUCK VERY HIGH SPEED',
      author: 'amazeme5',
      url: 'www.plebbit.com/r/duckfast',
      likes: 11,
      __v: 0,
    },
    {
      _id: '64a1d85357310b3ee2f85359',
      title: 'VERY WIDE DUCKS',
      author: 'amazeme5',
      url: 'www.plebbit.com/r/ducklong',
      likes: 18,
      __v: 0,
    },
    {
      _id: '64a1d87357310b3ee2f8535b',
      title: 'pen',
      author: 'helpmepls',
      url: 'https://www.google.com/search?q=pen',
      likes: 0,
      __v: 0,
    },
  ];

  test('amount of likes on a blog', () => {
    expect(favoriteBlog(blogs)).toEqual({
      author: 'fistkickkid22',
      likes: 117,
      title: 'Deadly Karate Donkey',
    });
  });

  test('amount of blogs made by an author', () => {
    expect(mostProlificAuthor(blogs)).toEqual({
      author: 'fistkickkid22',
      blogs: 3,
    });
  });

  test('amount of likes by an author', () => {
    expect(mostLikes(blogs)).toEqual({ author: 'fistkickkid22', likes: 249 });
  });
});
