"use server";
import { z } from "zod";
import { subscribeService } from "./services";

const subscribeSchema = z.object({
  email: z.email({
    error: "Please enter a valid email address",
  }),
});

export async function subscribeAction(prevState: any, formData: FormData) {
  const email = formData.get("email");
  
  const validatedFields = subscribeSchema.safeParse({
    email: email
  });

  if (!validatedFields.success) {
    console.dir(z.treeifyError(validatedFields.error), { depth: null})

    return {
      ...prevState,
      zodErrors: z.treeifyError(validatedFields.error),
      strapiErrors: null,
    }
  }
  
  const responseData = await subscribeService(validatedFields.data.email);
  
  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      errorMessage: "Oops! Something went wrong. Please try again.",
    }
  }
  
  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      errorMessage: "Failed to Subscribe.",
    }
  }
  
  return {
    ...prevState,
    zodErrors: null,
    strapiErrors: null,
    errorMessage: null,
    successMessage: "Successfully Subscribed!",
  }
}