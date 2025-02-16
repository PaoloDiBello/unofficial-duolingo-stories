import { query_objs } from "lib/db";
import { CourseTagList, CourseList } from "./courses";

async function course_list() {
  return await query_objs(`SELECT
    course.id,
    course.learningLanguage,
    course.fromLanguage,
    course.public,
    course.official,
    course.name,
    course.about,
    course.conlang,
    course.short,
    (
        SELECT GROUP_CONCAT(course_tag.name, ',')
        FROM course_tag_map
        LEFT JOIN course_tag ON course_tag.id = course_tag_map.course_tag_id
        WHERE course.id = course_tag_map.course_id
    ) AS tag_list
FROM course;
`);
}

async function course_tag_list() {
  return await query_objs(`SELECT * FROM course_tag;`);
}

async function language_list() {
  return await query_objs(`SELECT * FROM language;`);
}

export default async function Page({}) {
  let courses = await course_list();
  let course_tags = await course_tag_list();
  let languages = await language_list();

  return (
    <>
      <CourseTagList course_tags={course_tags} />
      <CourseList
        users={courses}
        languages={languages}
        course_tags={course_tags}
      />
    </>
  );
}
