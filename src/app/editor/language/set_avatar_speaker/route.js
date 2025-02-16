import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import query from "lib/db";
import { insert, update } from "lib/db";

export async function POST(req) {
  try {
    const { id, name, speaker, language_id, avatar_id } = await req.json();
    const token = await getToken({ req });

    if (!token?.role)
      return new Response("You need to be a registered contributor.", {
        status: 401,
      });

    let answer = await set_avatar({
      id,
      name,
      speaker,
      language_id,
      avatar_id,
    });

    if (answer === undefined)
      return new Response("Error not found.", { status: 404 });

    return NextResponse.json(answer);
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}

async function set_avatar({ id, name, speaker, language_id, avatar_id }) {
  let res = await query(
    `SELECT id FROM avatar_mapping WHERE language_id = ? AND avatar_id = ?;`,
    [language_id, avatar_id],
  );

  if (res.length) {
    id = res[0].id;
    return await update(
      "avatar_mapping",
      { id, name, speaker, language_id, avatar_id },
      ["name", "speaker", "language_id", "avatar_id"],
    );
  }
  return await insert(
    "avatar_mapping",
    { id, name, speaker, language_id, avatar_id },
    ["name", "speaker", "language_id", "avatar_id"],
  );
}
