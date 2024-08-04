import { IMyDetails } from "../MyRedux/Store";

//add comma after 3 numbers
export const formatNumber = (n: number) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const makeProfilePic = (MyDetails: IMyDetails) => {
  let profileImg: string = "";
  if (MyDetails?.profileImg) {
    profileImg = MyDetails.profileImg;
  } else {
    if (MyDetails?.gender === "male") {
      profileImg =
        "https://th.bing.com/th/id/OIP.MYwdjrgFU0JwL6ahVIdgZwHaH_?rs=1&pid=ImgDetMain";
    } else if (MyDetails?.gender === "female") {
      profileImg = "https://cdn-icons-png.flaticon.com/512/65/65581.png";
    } else {
      profileImg =
        "https://media.istockphoto.com/id/1305034196/vector/transgender-avatar-in-red-sweatshirt.jpg?s=612x612&w=is&k=20&c=K7kim26X_ZysaKGFT7h0tGA67VBYiPJuyN3kL7D2l1g=";
    }
  }
  return profileImg;
};
