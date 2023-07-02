const { totalLikes } = require("../utils/list_helper");
describe("total likes", () => {
  const blogs = [
    {
      _id: "64a1d7ea57310b3ee2f85357",
      title: "This Horse Knows Karate?!",
      author: "fistkickkid22",
      url: "www.karatehorse.com",
      likes: 91,
      __v: 0,
    },
    {
      _id: "64a1d85357310b3ee2f85359",
      title: "EXTREME FAST DUCK VERY HIGH SPEED",
      author: "amazeme5",
      url: "www.plebbit.com/r/duckfast",
      likes: 11,
      __v: 0,
    },
    {
      _id: "64a1d87357310b3ee2f8535b",
      title: "pen",
      author: "helpmepls",
      url: "https://www.google.com/search?q=pen",
      likes: 0,
      __v: 0,
    },
  ];
  const justOneBlog = blogs.slice(0, 1);

  test("of one value is the value itself", () => {
    expect(totalLikes(justOneBlog)).toBe(justOneBlog[0].likes);
  });

  test("of many is calculated right", () => {
    expect(totalLikes(blogs)).toBe(102);
  });

  test("of empty array is zero", () => {
    expect(totalLikes([])).toBe(0);
  });
});
