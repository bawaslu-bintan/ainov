export const dynamic = "force-dynamic";

export function GET() {
  const accessConfigured = Boolean(
    process.env.AINOV_USERNAME && process.env.AINOV_PASSWORD,
  );

  return Response.json({ accessConfigured });
}
