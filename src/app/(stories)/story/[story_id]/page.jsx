import React from "react";

import query from "lib/db";

import StoryWrapper from "./story_wrapper";
import { notFound } from "next/navigation";
import getUserId from "lib/getUserId";
import { get_localisation_dict } from "lib/get_localisation";

export async function get_story(story_id) {
  let res = await query(
    `SELECT l1.short AS fromLanguage, l2.short AS learningLanguage, c.fromLanguage as fromLanguageId,
              l1.name AS fromLanguageLong, l2.name AS learningLanguageLong, 
              l1.rtl AS fromLanguageRTL, l2.rtl AS learningLanguageRTL,
              story.id, story.json 
              FROM story 
              JOIN course c on story.course_id = c.id 
              LEFT JOIN language l1 ON l1.id = c.fromLanguage
              LEFT JOIN language l2 ON l2.id = c.learningLanguage 
              WHERE story.id = ?;`,
    [story_id],
  );
  if (res.length === 0) {
    //result.sendStatus(404);
    return;
  }
  let data = JSON.parse(res[0]["json"]);
  data.id = res[0]["id"];

  data.fromLanguage = res[0]["fromLanguage"];
  data.fromLanguageId = res[0]["fromLanguageId"];
  data.fromLanguageLong = res[0]["fromLanguageLong"];
  data.fromLanguageRTL = res[0]["fromLanguageRTL"];

  data.learningLanguage = res[0]["learningLanguage"];
  data.learningLanguageLong = res[0]["learningLanguageLong"];
  data.learningLanguageRTL = res[0]["learningLanguageRTL"];

  return data;
}

export async function get_story_meta(course_id) {
  const course_query = await query(
    `SELECT
        story.name AS fromLanguageName,
        l1.name AS fromLanguageLong,     
        l2.name AS learningLanguageLong 
    FROM story 
    JOIN course c on story.course_id = c.id 
    LEFT JOIN language l1 ON l1.id = c.fromLanguage
    LEFT JOIN language l2 ON l2.id = c.learningLanguage 
    WHERE story.id = ?;
        `,
    [course_id],
  );

  if (course_query.length === 0) return undefined;
  return Object.assign({}, course_query[0]);
}

export async function generateMetadata({ params, searchParams }, parent) {
  const story = await get_story_meta(params.story_id);

  if (!story) notFound();

  const meta = await parent;

  return {
    title: `Duostories ${story.learningLanguageLong} from ${story.fromLanguageLong}: ${story.fromLanguageName}`,
    alternates: {
      canonical: `https://duostories.org/story/${params.story_id}`,
    },
    keywords: [story.learningLanguageLong, ...meta.keywords],
  };
}

export default async function Page({ params }) {
  const story = await get_story(params.story_id);

  const user_id = await getUserId();
  const story_id = parseInt(params.story_id);

  const localization = await get_localisation_dict(story.fromLanguageId);

  async function setStoryDoneAction() {
    "use server";
    if (!user_id) {
      await query(`INSERT INTO story_done (story_id) VALUES(?)`, [story_id]);
      return { message: "done", story_id: story_id };
    }
    await query(`INSERT INTO story_done (user_id, story_id) VALUES(?, ?)`, [
      user_id,
      story_id,
    ]);
    return { message: "done", story_id: story_id };
  }

  return (
    <>
      <StoryWrapper
        story={story}
        storyFinishedIndexUpdate={setStoryDoneAction}
        localization={localization}
      />
    </>
  );
}
