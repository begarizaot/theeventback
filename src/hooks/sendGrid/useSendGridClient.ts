export const useSendGridClient = () => {
  const validateEmail = async (email: string) => {
    try {
      // Primary service: mails.so
      const response = await fetch(
        `
        https://api.kickbox.com/v2/verify?email=${email}&apikey=${process.env.EMAIL_VALIDATE}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`mails.so API error: ${response.status}`);
      }

      const data: any = await response.json();
      if (
        data &&
        (data.result == "deliverable" ||
          data.result == "low_deliverability" ||
          data.result == "risky")
      ) {
        return "Valid";
      } else {
        return "Invalid";
      }
    } catch (error) {
      console.error("Error validating email:", error);
      return "Invalid";
    }
  };

  return { validateEmail };
};
