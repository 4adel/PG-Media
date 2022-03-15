import PG from "./Postgres";

export default async function (username: any) {
  let FindUsername;
  try {
    FindUsername = await PG.db.query({
      name: "Check Username Avilibility",
      text: `
                SELECT FROM used_usernames
                WHERE username = $1;
            `,
      values: [username],
    });
  } catch (error) {
    return false;
  }

  if (FindUsername.rowCount === 0) {
    return true;
  } else {
    return false;
  }
}
