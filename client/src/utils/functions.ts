export const move = (arr: string[], type: string, index: number): string[] => {
  const priority2 = [...arr];
  var prev;
  if (type === "up") {
    if (index === 0) {
      prev = priority2[priority2.length - 1];
      priority2[priority2.length - 1] = priority2[index];
      priority2[index] = prev;
    } else {
      prev = priority2[index - 1];
      priority2[index - 1] = priority2[index];
      priority2[index] = prev;
    }
  } else {
    if (index === 2) {
      prev = priority2[0];
      priority2[0] = priority2[index];
      priority2[index] = prev;
    } else {
      prev = priority2[index + 1];
      priority2[index + 1] = priority2[index];
      priority2[index] = prev;
    }
  }
  return priority2;
};

// export const getUserData = async () => {
//   const {
//     dispatch,
//     store: { MyDetails },
//   } = useGlobalContext();
//   try {
//     dispatch("loading", true);
//     const { data } = await axios.get("/api/v1/myaccount", {
//       withCredentials: true,
//     });

//     console.log({ data });
//     if (data.success) {
//       dispatch("MyDetails", { ...MyDetails, ...data.user });
//     }
//     if (data.error) {
//       toast.error(data.error, {
//         position: "bottom-center",
//       });
//     }
//   } catch (error: any) {
//     console.log("Error getting user data", error);
//     toast.error(error.message, {
//       position: "bottom-center",
//     });
//   }
//   dispatch("loading", false);
// };
