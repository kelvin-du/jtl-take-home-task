import { useState } from "react";
import type { SubmitEvent } from "react";
import { useCreateUser } from "../hooks";
import type { User } from "../types";
import { userInputSchema } from "../validation";

interface CreateUserFormProps {
  onUserCreated?: (user: User) => void;
  onCreateError?: (error: Error) => void;
}

export const CreateUserForm = ({
  onUserCreated,
  onCreateError,
}: CreateUserFormProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    username: string | null;
    email: string | null;
  }>({ username: null, email: null });
  const createUserMutation = useCreateUser();

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = userInputSchema.safeParse({ username, email });
    if (!result.success) {
      setValidationErrors({
        username:
          result.error.issues.find((issue) => issue.path[0] === "username")
            ?.message ?? null,
        email:
          result.error.issues.find((issue) => issue.path[0] === "email")
            ?.message ?? null,
      });
      return;
    }

    setValidationErrors({ username: null, email: null });
    createUserMutation.mutate(result.data, {
      onSuccess: (user) => {
        setUsername("");
        setEmail("");
        onUserCreated?.(user);
      },
      onError: onCreateError,
    });
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setValidationErrors((errors) => ({ ...errors, username: null }));
    createUserMutation.reset();
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setValidationErrors((errors) => ({ ...errors, email: null }));
    createUserMutation.reset();
  };

  const emailDescribedBy =
    [
      validationErrors.email && "email-error",
      createUserMutation.isError && "create-user-error",
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <form className="grid gap-3" noValidate onSubmit={handleSubmit}>
      <div className="grid gap-1">
        <label className="font-medium" htmlFor="username">
          Username
        </label>
        <input
          autoComplete="username"
          className="rounded border border-slate-300 px-3 py-2"
          disabled={createUserMutation.isPending}
          id="username"
          name="username"
          onChange={(event) => handleUsernameChange(event.target.value)}
          required
          type="text"
          value={username}
          aria-describedby={
            validationErrors.username ? "username-error" : undefined
          }
          aria-invalid={validationErrors.username !== null}
        />
        {validationErrors.username && (
          <p className="text-sm text-red-700" id="username-error" role="alert">
            {validationErrors.username}
          </p>
        )}
      </div>
      <div className="grid gap-1">
        <label className="font-medium" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          className="rounded border border-slate-300 px-3 py-2"
          disabled={createUserMutation.isPending}
          id="email"
          name="email"
          onChange={(event) => handleEmailChange(event.target.value)}
          required
          type="email"
          value={email}
          aria-describedby={emailDescribedBy}
          aria-invalid={
            validationErrors.email !== null || createUserMutation.isError
          }
        />
        {validationErrors.email && (
          <p className="text-sm text-red-700" id="email-error" role="alert">
            {validationErrors.email}
          </p>
        )}
        {createUserMutation.isError && (
          <p
            className="text-sm text-red-700"
            id="create-user-error"
            role="alert"
          >
            {createUserMutation.error.message || "Could not create the user."}
          </p>
        )}
      </div>
      <button
        className="w-fit rounded bg-primary px-4 py-2 font-medium text-white disabled:opacity-60"
        disabled={createUserMutation.isPending}
        type="submit"
      >
        {createUserMutation.isPending ? "Creating..." : "Create user"}
      </button>
    </form>
  );
};
