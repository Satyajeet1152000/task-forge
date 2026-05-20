import SignupForm from "@/modules/auth/components/signup-form";

function getQueryParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function SignupPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<React.ReactElement> {
  const searchParams = await props.searchParams;

  return (
    <SignupForm
      inviteCode={getQueryParam(searchParams.invite)}
      inviteEmail={getQueryParam(searchParams.email)}
    />
  );
}
