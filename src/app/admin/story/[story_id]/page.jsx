import { query_objs } from "lib/db";
import { notFound } from "next/navigation";
import StoryDisplay from "./story_display";

async function story_properties(id) {
  let data = await query_objs(
    `SELECT story.id, story.name, story.image, story.public, course.short FROM story JOIN course ON course.id = story.course_id WHERE story.id = ?;`,
    [parseInt(id)],
  );
  if (data.length === 0) return undefined;
  let story = data[0];
  story.approvals = await query_objs(
    `SELECT a.id, a.date, u.username FROM story_approval a JOIN user u ON u.id = a.user_id WHERE a.story_id = ?`,
    [id],
  );
  return story;
}

export default async function Page({ params }) {
  let story = await story_properties(params.story_id);

  if (story === undefined) notFound();

  return <StoryDisplay story={story} />;
}
