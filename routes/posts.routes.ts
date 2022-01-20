import { Router, RouterContext } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

const posts = [{
  title: "title 1",
  description: "description 1",
  id: 1,
}, {
  title: "title 2",
  description: "description 2",
  id: 2,
}];

router.get("/posts", ({ response }: RouterContext<"/posts">) => {
  response.body = posts;
});

router.post(
  "/posts",
  async ({ response, request }: RouterContext<"/posts">) => {
    const body = request.body();

    const newUser = {
      ...await body.value,
      id: posts.length + 1,
    };
    posts.push(newUser);
    response.body = posts;
  },
);

interface Post {
  title: string;
  description: string;
  id: number;
}

router.put("/posts/:id", async (ctx: RouterContext<"/posts/:id">) => {
  const { id } = ctx.params;

  const body = ctx.request.body();
  const { title, description }: Post = await body.value;

  if (!ctx.request.hasBody) {
    return;
  }

  for (const post of posts) {
    if (post.id === Number(id)) {
      post.title = title;
      post.description = description;
    }
  }

  ctx.response.body = posts;
});

router.delete("/posts/:id", (ctx: RouterContext<"/posts/:id">) => {
  const { id } = ctx.params;

  const post = posts.find((post) => post.id === Number(id));

  if (!post) return;

  const idx = posts.indexOf(post);
  posts.splice(idx, 1);

  ctx.response.body = posts;
});

export default router;
