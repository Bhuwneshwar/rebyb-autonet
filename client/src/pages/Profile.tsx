import React, { useEffect, useState, ChangeEvent } from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { toast } from "react-toastify";
import { useGlobalContext } from "../MyRedux";
import { formatDate } from "../utils/formatDate";
import ClipboardCopy from "../components/ClipboardCopy";
import { NavLink, useNavigate } from "react-router-dom";
import { move } from "../utils/functions";

interface ProfileEdit {
  name?: string;
  email?: string;
  gender?: string;
  age?: number;
  contact?: string;
  contactOTP?: string;
  emailOTP?: string;
  newReferCode?: string;
  newPassword?: string;
  confirmPassword?: string;
  oldPassword?: string;
  rechNum1?: string;
  rechNum2?: string;
  rechNum3?: string;
  opera1?: string;
  opera2?: string;
  opera3?: string;
  state1?: string;
  state2?: string;
  state3?: string;
  SelectedPlan1?: string;
  SelectedPlan2?: string;
  SelectedPlan3?: string;
  ExistingValidityOne?: number;
  ExistingValiditytwo?: number;
  ExistingValiditythree?: number;
  transactionMethod?: string;
  autoRecharge?: boolean;
  autoWithdraw?: boolean;
  NextInvest?: boolean;
  upi?: string;
  ifsc?: string;
  bank?: string;
  confirmBank?: string;
  withdraw_perc: number;
}

interface EditToggle {
  name: boolean;
  email: boolean;
  gender: boolean;
  age: boolean;
  contact: boolean;
  newReferCode: boolean;
}

interface Notify {
  num1: string;
  num2: string;
  num3: string;
}

interface InitialOptions {
  operators: string[];
  states: string[];
  RechargePlans: string[];
  transactionMethods: string[];
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const {
    store: { MyDetails },
    dispatch,
  } = useGlobalContext();

  const coverImg =
    MyDetails?.coverImg ||
    "https://getwallpapers.com/wallpaper/full/e/4/a/1176156-download-free-fb-wallpaper-of-cover-2560x1440-ipad-retina.jpg";

  let profileImg;
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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

      if (!isValidType) {
        return alert("Only image files are allowed.");
      }
      if (!isValidSize) {
        return alert("File size must be less than 5MB.");
      }
      uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("coverPic", file);

    try {
      dispatch("loading", true);
      const { data } = await axios.post("/api/v1/upload-cover-pic", formData, {
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.loaded && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload progress: ${percentCompleted}%`);
          }
          // Update your progress bar here
        },
      });

      console.log("File uploaded successfully:", { data });

      if (data.success) {
        if (MyDetails) {
          dispatch("MyDetails", { ...MyDetails, coverImg: data.coverImg });
          toast.success("Cover image uploaded successfully!");
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading cover image!");
    }
    dispatch("loading", false);
  };

  const handleFileChangeProfile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

      if (!isValidType) {
        return alert("Only image files are allowed.");
      }
      if (!isValidSize) {
        return alert("File size must be less than 5MB.");
      }
      uploadFileProfile(file);
    }
  };

  const uploadFileProfile = async (file: File) => {
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      dispatch("loading", true);
      const { data } = await axios.post(
        "/api/v1/upload-profile-pic",
        formData,
        {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.loaded && progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              console.log(`Upload progress: ${percentCompleted}%`);
            }
            // Update your progress bar here
          },
        }
      );

      console.log("File uploaded successfully:", { data });

      if (data.success) {
        if (MyDetails) {
          dispatch("MyDetails", { ...MyDetails, profileImg: data.profileImg });
          toast.success("Upload Successfully", {
            position: "bottom-center",
          });
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file!", {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };

  const [profileEdit, setProfileEdit] = useState<ProfileEdit>({
    name: MyDetails?.name,
    email: MyDetails?.email,
    gender: MyDetails?.gender,
    age: MyDetails?.age,
    contact: MyDetails?.contact,
    contactOTP: "",
    emailOTP: "",
    newReferCode: MyDetails?.referCode,
    newPassword: "",
    confirmPassword: "",
    oldPassword: "",
    rechNum1: MyDetails?.rechargeNum1?.number || "",
    rechNum2: MyDetails?.rechargeNum2?.number || "",
    rechNum3: MyDetails?.rechargeNum3?.number || "",
    opera1: MyDetails?.rechargeNum1?.operator || "",
    opera2: MyDetails?.rechargeNum2?.operator || "",
    opera3: MyDetails?.rechargeNum3?.operator || "",
    state1: MyDetails?.rechargeNum1?.state || "",
    state2: MyDetails?.rechargeNum2?.state || "",
    state3: MyDetails?.rechargeNum3?.state || "",
    SelectedPlan1: MyDetails?.rechargeNum1?.plan || "",
    SelectedPlan2: MyDetails?.rechargeNum2?.plan || "",
    SelectedPlan3: MyDetails?.rechargeNum3?.plan || "",
    ExistingValidityOne: MyDetails?.rechargeNum1?.validity || 0,
    ExistingValiditytwo: MyDetails?.rechargeNum2?.validity || 0,
    ExistingValiditythree: MyDetails?.rechargeNum3?.validity || 0,
    transactionMethod: MyDetails?.transactionMethod || "",
    autoRecharge: MyDetails?.autoRecharge || false,
    autoWithdraw: MyDetails?.autoWithdraw || false,
    NextInvest: MyDetails?.NextInvest || false,
    upi: MyDetails?.upi || "",
    ifsc: MyDetails?.ifsc || "",
    bank: MyDetails?.bank || "",
    confirmBank: "",
    withdraw_perc: 60,
  });

  const [editToggle, setEditToggle] = useState<EditToggle>({
    name: false,
    email: false,
    gender: false,
    age: false,
    contact: false,
    newReferCode: false,
  });

  const [notify, setNotify] = useState<Notify>({
    num1: "",
    num2: "",
    num3: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setProfileEdit({ ...profileEdit, [e.target.name]: e.target.value });
  };

  const updateName = async () => {
    try {
      dispatch("loading", true);
      const { data } = await axios.post(
        "/api/v1/update-user-details",
        {
          name: profileEdit.name,
        },
        {
          withCredentials: true,
        }
      );
      console.log({ data });
      if (data.success) {
        if (MyDetails) {
          dispatch("MyDetails", { ...MyDetails, name: data.name });
          setEditToggle((prev) => ({ ...prev, name: !prev.name }));
          toast.success("Name updated successfully!", {
            position: "bottom-center",
          });
        }
      }
      if (data.error) {
        toast.error(data.error, {
          position: "bottom-center",
        });
      }
    } catch (error: any) {
      console.error("updateName error :", error);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };

  const updateAge = async () => {
    try {
      dispatch("loading", true);
      const { data } = await axios.post(
        "/api/v1/update-user-details",
        {
          age: profileEdit.age,
        },
        {
          withCredentials: true,
        }
      );
      console.log({ data });
      if (data.success) {
        if (MyDetails) {
          dispatch("MyDetails", { ...MyDetails, age: data.age });
          setEditToggle((prev) => ({ ...prev, age: !prev.age }));
          toast.success("Age updated successfully!", {
            position: "bottom-center",
          });
        }
      }
      if (data.error) {
        toast.error(data.error, {
          position: "bottom-center",
        });
      }
    } catch (error: any) {
      console.error("updateAge error :", error);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };
  const updateGender = async () => {
    try {
      dispatch("loading", true);
      const { data } = await axios.post(
        "/api/v1/update-user-details",
        {
          gender: profileEdit.gender,
        },
        {
          withCredentials: true,
        }
      );
      console.log({ data });
      if (data.success) {
        if (MyDetails) {
          dispatch("MyDetails", { ...MyDetails, gender: data.gender });
          setEditToggle((prev) => ({ ...prev, gender: !prev.gender }));
          toast.success("Gender updated successfully!", {
            position: "bottom-center",
          });
        }
      }
      if (data.error) {
        toast.error(data.error, {
          position: "bottom-center",
        });
      }
    } catch (error: any) {
      console.error("updateGender error :", error);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };

  function formatTime(milliseconds: number) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  const [showDueTimeEmail, setShowDueTimeEmail] = useState("");
  let idEmail: number;
  const sendEmailOTP = async () => {
    try {
      dispatch("loading", true);
      const { data } = await axios.post(
        "/api/v1/email/otp/send",
        {
          email: profileEdit.email,
        },
        {
          withCredentials: true,
        }
      );
      console.log({ data });
      if (data.success) {
        setProfileEdit((prev) => ({ ...prev, emailOTP: data.otp }));
        setEditToggle((prev) => ({ ...prev, email: !prev.email }));
        toast.success("OTP sent successfully!", {
          position: "bottom-center",
        });
      }

      if (data.dueTimeMs) {
        let dueTimeMs = data.dueTimeMs; // 30 seconds in milliseconds
        setShowDueTimeEmail(formatTime(dueTimeMs));

        if (idEmail) clearInterval(idEmail);
        id = setInterval(() => {
          dueTimeMs -= 1000;

          if (dueTimeMs < 0) {
            clearInterval(idEmail);
            setShowDueTimeEmail("");
          } else {
            setShowDueTimeEmail(formatTime(dueTimeMs));
          }
        }, 1000);

        toast.warning("Please wait... " + formatTime(dueTimeMs), {
          position: "bottom-center",
        });
      }

      if (data.error) {
        toast.error(data.error, {
          position: "bottom-center",
        });
      }
    } catch (error: any) {
      console.error("sendEmailOTP error :", error);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };

  const [showDueTime, setShowDueTime] = useState("");
  let id: any;
  const sendContactOTP = async () => {
    try {
      dispatch("loading", true);
      const { data } = await axios.post(
        "/api/v1/phone/otp/send",
        {
          contact: profileEdit.contact,
        },
        {
          withCredentials: true,
        }
      );
      console.log({ data });
      if (data.success) {
        setProfileEdit((prev) => ({ ...prev, contactOTP: data.otp }));
        setEditToggle((prev) => ({ ...prev, contact: !prev.contact }));
        toast.success("OTP sent successfully!", {
          position: "bottom-center",
        });
      }

      if (data.dueTimeMs) {
        let dueTimeMs = data.dueTimeMs; // 30 seconds in milliseconds
        setShowDueTime(formatTime(dueTimeMs));

        if (id) clearInterval(id);
        id = setInterval(() => {
          dueTimeMs -= 1000;

          if (dueTimeMs < 0) {
            clearInterval(id);
            setShowDueTime("");
          } else {
            setShowDueTime(formatTime(dueTimeMs));
          }
        }, 1000);

        toast.warning("Please wait... " + formatTime(dueTimeMs), {
          position: "bottom-center",
        });
      }

      if (data.error) {
        toast.error(data.error, {
          position: "bottom-center",
        });
      }
    } catch (error: any) {
      console.error("sendContactOTP error :", error);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };

  const verifyContactOTP = async () => {
    try {
      dispatch("loading", true);
      const { data } = await axios.post(
        "/api/v1/phone/otp/verify",
        {
          contact: profileEdit.contact,
          userOtp: profileEdit.contactOTP,
          verifyReason: "updateContact",
        },
        {
          withCredentials: true,
        }
      );
      console.log({ data });
      if (data.success) {
        if (MyDetails) {
          dispatch("MyDetails", {
            ...MyDetails,
            contact: data.verifiedContact,
          });
        }
        setEditToggle((prev) => ({
          ...prev,
          contact: !prev.contact,
        }));
        toast.success("Contact updated successfully!", {
          position: "bottom-center",
        });
      }

      if (data.worning) {
        toast.warning(data.worning, {
          position: "bottom-center",
        });
      }
      if (data.error) {
        toast.error(data.error, {
          position: "bottom-center",
        });
      }
    } catch (error: any) {
      console.error("verifyContactOTP error :", error);
      toast.error(error.message);
    }
    dispatch("loading", false);
  };
  const verifyEmailOTP = async () => {
    try {
      dispatch("loading", true);
      const { data } = await axios.post(
        "/api/v1/email/otp/verify",
        {
          email: profileEdit.email,
          userOtp: profileEdit.emailOTP,
          verifyReason: "updateEmail",
        },
        {
          withCredentials: true,
        }
      );
      console.log({ data });
      if (data.success) {
        if (MyDetails) {
          dispatch("MyDetails", {
            ...MyDetails,
            email: data.verifiedEmail,
          });
        }
        setEditToggle((prev) => ({
          ...prev,
          email: !prev.email,
        }));
        toast.success("Email updated successfully!", {
          position: "bottom-center",
        });
      }

      if (data.worning) {
        toast.warning(data.worning, {
          position: "bottom-center",
        });
      }
      if (data.error) {
        toast.error(data.error, {
          position: "bottom-center",
        });
      }
    } catch (error: any) {
      console.error("verifyEmailOTP error :", error);
      toast.error(error.message);
    }
    dispatch("loading", false);
  };
  const setReferCode = async () => {
    try {
      dispatch("loading", true);
      const { data } = await axios.post(
        "/api/v1/account-refer",
        { newReferCode: profileEdit.newReferCode },
        {
          withCredentials: true,
        }
      );

      console.log({ data });

      if (data.success) {
        toast.success("Referral code set successfully!", {
          position: "bottom-center",
        });
        if (MyDetails) {
          dispatch("MyDetails", {
            ...MyDetails,
            referCode: data.newReferCode,
          });
        }
        setEditToggle((prev) => ({
          ...prev,
          newReferCode: !prev.newReferCode,
        }));
      }
      if (data.error) {
        toast.error(data.error, {
          position: "bottom-center",
        });
      }
    } catch (e: any) {
      console.log(e);
      toast.error(e.message, {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };
  const genReferCode = async () => {
    try {
      dispatch("loading", true);
      const { data } = await axios.get("/api/v1/account-refer", {
        withCredentials: true,
      });

      console.log({ data });

      if (data.success) {
        toast.success("Referral code generated successfully!", {
          position: "bottom-center",
        });
        setProfileEdit((prev) => ({
          ...prev,
          newReferCode: data.generatedReferCode,
        }));
      }
      if (data.error) {
        toast.error(data.error, {
          position: "bottom-center",
        });
      }
    } catch (e: any) {
      console.log(e);
      toast.error(e.message, {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };

  const changePassword = async () => {
    try {
      if (profileEdit.newPassword !== profileEdit.confirmPassword) {
        return toast.error("New password and confirm password do not match", {
          position: "bottom-center",
        });
      }

      dispatch("loading", true);

      const { data } = await axios.post(
        "/api/v1/change-password",
        {
          oldPassword: profileEdit.oldPassword,
          newPassword: profileEdit.newPassword,
        },
        {
          withCredentials: true,
        }
      );

      console.log({ data });
      if (data.success) {
        toast.success("Password change successfully", {
          position: "bottom-center",
        });
        setProfileEdit((prev) => ({
          ...prev,
          newPassword: "",
          oldPassword: "",
          confirmPassword: "",
        }));
      }
      if (data.error) {
        toast.error(data.error, {
          position: "bottom-center",
        });
      }
    } catch (e: any) {
      console.log(e);
      toast.error(e.message, {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };
  const setPassword = async () => {
    try {
      if (profileEdit.newPassword !== profileEdit.confirmPassword) {
        return toast.error("New password and confirm password do not match", {
          position: "bottom-center",
        });
      }

      dispatch("loading", true);

      const { data } = await axios.post(
        "/api/v1/set-password",
        { newPassword: profileEdit.newPassword },
        {
          withCredentials: true,
        }
      );
      console.log({ data });
      if (data.success) {
        toast.success("Password set successfully", {
          position: "bottom-center",
        });
        if (MyDetails) {
          dispatch("MyDetails", { ...MyDetails, password: data.newPassword });
        }
        setProfileEdit((prev) => ({
          ...prev,
          newPassword: "",
          oldPassword: "",
          confirmPassword: "",
        }));
      }
      if (data.error) {
        toast.error(data.error, {
          position: "bottom-center",
        });
      }
    } catch (e: any) {
      console.log(e);
      toast.error(e.message, {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent default form submission behavior

    // // Access form data here
    // const formData = new FormData(event.currentTarget as HTMLFormElement);

    // // Example: Extract data from specific fields
    // const name = formData.get('name');
    // const email = formData.get('email');

    // // Perform validation or processing on the data
    // if (!name || !email) {
    //   alert('Please enter your name and email.');
    //   return;
    // }

    // // Submit data (e.g., using fetch API)
    // fetch('/submit-data', {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     // Handle successful submission (e.g., display confirmation message)
    //     console.log('Data submitted successfully:', data);
    //   })
    //   .catch(error => {
    //     // Handle errors (e.g., display error message)
    //     console.error('Error submitting data:', error);
    //   });
  }

  const [InitialOptions, setInitialOptions] = useState<InitialOptions>({
    operators: [],
    states: [],
    RechargePlans: [],
    transactionMethods: [],
  });

  const [priority, setPriority] = useState([
    "recharge",
    "nextInvest",
    "withdraw",
  ]);
  interface CurOperator {
    price: number;
    validity: number;
    options: string;
  }
  const [curOpera1, setCurOpera1] = useState<CurOperator[]>([]);
  const [curOpera2, setCurOpera2] = useState<CurOperator[]>([]);
  const [curOpera3, setCurOpera3] = useState<CurOperator[]>([]);

  const updateRechargeNumber = async () => {
    try {
      dispatch("loading", true);
      const { data } = await axios.post(
        "/api/v1/update-user-details",
        {
          rechargeNum1: profileEdit.rechNum1,
        },
        {
          withCredentials: true,
        }
      );
      console.log({ data });
      if (data.success) {
        if (MyDetails) {
          dispatch("MyDetails", {
            ...MyDetails,
            rechargeNum1: data.rechargeNum1,
          });
        }
        toast.success("Recharge Number 1 updated successfully!", {
          position: "bottom-center",
        });
      }
      if (data.error) {
        toast.error(data.error, {
          position: "bottom-center",
        });
      }
    } catch (error: any) {
      console.error("update number 1 error :", error);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };

  const initial = async () => {
    try {
      // dispatch("loading", true);
      const res = await axios.get("/api/v1/registration");
      console.log({ ...res.data });

      if (res.data.success) {
        setInitialOptions({
          operators: res.data.operators,
          states: res.data.states,
          RechargePlans: res.data.RechargePlans,
          transactionMethods: res.data.transactionMethods,
        });
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to load initial data", {
        position: "bottom-center",
      });
    }
    // dispatch("loading", false);
  };
  // 250 + 250 + 125 + 125 + 125 + 125 = output
  // Call uploadFile with your file input (e.g., from an input field)

  const moveMe = (arr: string[], topbottm: "up" | "down", index: number) => {
    const array = move(arr, topbottm, index);
    setPriority(array);
  };

  useEffect(() => {
    // Update profileEdit state when MyDetails changes
    if (MyDetails) {
      setProfileEdit((prevProfileEdit) => ({
        ...prevProfileEdit,
        name: MyDetails.name,
        email: MyDetails.email,
        gender: MyDetails.gender,
        age: MyDetails.age,
        contact: MyDetails.contact,
        newReferCode: MyDetails.referCode,
        rechNum1: MyDetails.rechargeNum1?.number || "",
        rechNum2: MyDetails.rechargeNum2?.number || "",
        rechNum3: MyDetails.rechargeNum3?.number || "",
        opera1: MyDetails.rechargeNum1?.operator || "",
        opera2: MyDetails.rechargeNum2?.operator || "",
        opera3: MyDetails.rechargeNum3?.operator || "",
        state1: MyDetails.rechargeNum1?.state || "",
        state2: MyDetails.rechargeNum2?.state || "",
        state3: MyDetails.rechargeNum3?.state || "",
        SelectedPlan1: MyDetails.rechargeNum1?.plan || "",
        SelectedPlan2: MyDetails.rechargeNum2?.plan || "",
        SelectedPlan3: MyDetails.rechargeNum3?.plan || "",
        ExistingValidityOne: MyDetails.rechargeNum1?.validity || 0,
        ExistingValiditytwo: MyDetails.rechargeNum2?.validity || 0,
        ExistingValiditythree: MyDetails.rechargeNum3?.validity || 0,
        transactionMethod: MyDetails.transactionMethod || "",
        autoRecharge: MyDetails.autoRecharge || false,
        autoWithdraw: MyDetails.autoWithdraw || false,
        NextInvest: MyDetails.NextInvest || false,
        upi: MyDetails.upi || "",
        ifsc: MyDetails.ifsc || "",
        bank: MyDetails.bank || "",
      }));
    }
  }, [MyDetails]);

  useEffect(() => {
    console.log("first time render");
    initial();
  }, []);

  return (
    MyDetails && (
      <div className="profile">
        <div className="cover-img">
          <figure>
            <img src={coverImg} alt="cover image" />
          </figure>
          <label htmlFor="coverPic" className="choose-img">
            <CameraAltIcon />
            <input
              hidden
              onChange={handleFileChange}
              id="coverPic"
              type="file"
              accept="image/*"
            />
          </label>

          <div className="profile-pic">
            <figure>
              <img src={profileImg} alt="profile image" />
            </figure>
            <label htmlFor="profilePic" className="choose-img">
              <CameraAltIcon />
              <input
                hidden
                onChange={handleFileChangeProfile}
                id="profilePic"
                type="file"
                accept="image/*"
              />
            </label>
          </div>
        </div>

        <div className="details">
          <form onSubmit={submit}>
            <h1>
              <input
                type="text"
                disabled={!editToggle.name}
                onBlur={updateName}
                onChange={handleChange}
                value={profileEdit.name}
                name="name"
                placeholder="Name"
                required
              />
              <span
                onClick={(e) =>
                  setEditToggle({ ...editToggle, name: !editToggle.name })
                }
              >
                <EditIcon />
              </span>
            </h1>
            <div className="bio">
              <div className="age">
                <div>Age: </div>
                <div>
                  <input
                    type="number"
                    disabled={!editToggle.age}
                    onBlur={updateAge}
                    onChange={handleChange}
                    value={profileEdit.age}
                    name="age"
                    placeholder="Age"
                    required
                  />
                  <span
                    onClick={(e) =>
                      setEditToggle({ ...editToggle, age: !editToggle.age })
                    }
                  >
                    <EditIcon />
                  </span>
                </div>
              </div>

              <div className="gender">
                <div>Gender: </div>
                <div>
                  <span> {MyDetails?.gender} </span>

                  <select
                    value={profileEdit.gender}
                    name="gender"
                    id="gender"
                    disabled={!editToggle.gender}
                    onChange={handleChange}
                    required
                    onBlur={updateGender}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <span
                    onClick={(e) =>
                      setEditToggle({
                        ...editToggle,
                        gender: !editToggle.gender,
                      })
                    }
                  >
                    <EditIcon />
                  </span>
                </div>
              </div>
            </div>
            <div className="date">
              <p>Date of Registration: {formatDate(MyDetails?.RegisteredAt)}</p>
            </div>
            <div className="contact-info">
              <p>contact information</p>
              <div className="contact">
                <p className="label">Contact Number</p>
                <div>
                  <input
                    value={profileEdit.contact}
                    name="contact"
                    id="contact"
                    disabled={!editToggle.contact}
                    onChange={handleChange}
                    required
                    onBlur={sendContactOTP}
                    type="number"
                  />

                  <span
                    onClick={(e) =>
                      setEditToggle({
                        ...editToggle,
                        contact: !editToggle.contact,
                      })
                    }
                  >
                    <EditIcon />
                  </span>
                  <p>{showDueTime}</p>
                </div>
                <div>
                  <p className="label-otp">OTP</p>
                  <input
                    value={profileEdit.contactOTP}
                    name="contactOTP"
                    id="contactOTP"
                    // disabled={!editToggle.contact}
                    onChange={handleChange}
                    onBlur={verifyContactOTP}
                    type="number"
                    className="otp"
                    placeholder="Contact OTP"
                  />
                  <button>Update</button>
                </div>
              </div>
              <div className="contact">
                <p className="label">Email</p>
                <div>
                  <input
                    value={profileEdit.email}
                    name="email"
                    id="email"
                    disabled={!editToggle.email}
                    onChange={handleChange}
                    required
                    onBlur={sendEmailOTP}
                    type="email"
                  />
                  <span
                    onClick={(e) =>
                      setEditToggle({
                        ...editToggle,
                        email: !editToggle.email,
                      })
                    }
                  >
                    <EditIcon />
                  </span>
                  <p>{showDueTimeEmail}</p>
                </div>
                <div>
                  <p className="label-otp">OTP</p>
                  <input
                    value={profileEdit.emailOTP}
                    name="emailOTP"
                    id="emailOTP"
                    // disabled={!editToggle.email}
                    onChange={handleChange}
                    onBlur={verifyEmailOTP}
                    type="number"
                    className="otp"
                    placeholder="email OTP"
                  />
                  <button>Update</button>
                </div>
              </div>
            </div>
            <div className="ids">
              <div className="main-id">
                <p className="label">My ID:</p>
                <p>
                  {MyDetails._id}{" "}
                  <button>
                    <ClipboardCopy code={MyDetails._id} />
                  </button>
                </p>
              </div>
              <div className="refer-id">
                <p className="label">My Refer Code: </p>

                <input
                  value={profileEdit.newReferCode}
                  onChange={handleChange}
                  name="newReferCode"
                  id="newReferCode"
                  disabled={!editToggle.newReferCode}
                  onBlur={setReferCode}
                />
                <button>
                  <ClipboardCopy code={MyDetails.referCode} />
                </button>
                <button
                  onClick={(e) =>
                    setEditToggle((prev) => ({
                      ...prev,
                      newReferCode: !prev.newReferCode,
                    }))
                  }
                >
                  Edit
                </button>
                <button onClick={genReferCode}>Regenerate</button>
              </div>
            </div>
            <div className="balance">
              <p className="label">My Balance: </p>
              <p>{MyDetails.Balance}</p>
            </div>

            <div className="rech-for-num">
              <h2>Recharge for numbers</h2>
              <div className="responsive">
                <div className="num">
                  <label htmlFor="rechNum1">Recharge For Number 1</label>
                  <input
                    type="number"
                    onChange={handleChange}
                    name="rechNum1"
                    id="rechNum1"
                    // onFocus={handleFocus}
                    onBlur={updateRechargeNumber}
                    value={profileEdit.rechNum1}
                    placeholder="Recharge num 1"
                  />
                  <p>{notify.num1}</p>
                </div>
                <div className="opera">
                  <label htmlFor="opera1">Select Operator For Number 1</label>
                  <select
                    value={profileEdit.opera1}
                    onChange={handleChange}
                    name="opera1"
                    id="opera1"
                  >
                    <option value="">Select Operator</option>
                    {InitialOptions.operators.map((v, i) => {
                      return (
                        <option key={i} value={v}>
                          {v}
                        </option>
                      );
                    })}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="opera">
                  <label htmlFor="state1">Select State For Number 1</label>

                  <select
                    value={profileEdit.state1}
                    onChange={handleChange}
                    name="state1"
                    id="state1"
                  >
                    <option value="">Select State</option>
                    {InitialOptions.states.map((v, i) => {
                      return (
                        <option key={i} value={v}>
                          {v}
                        </option>
                      );
                    })}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="opera">
                  <label htmlFor="SelectedPlan1">
                    Select A Plan For Number 1
                  </label>

                  <select
                    onChange={handleChange}
                    name="SelectedPlan1"
                    id="SelectedPlan1"
                  >
                    <option value="">Select Plan</option>
                    {curOpera1.map((v, i) => {
                      return (
                        <option
                          key={i}
                          className="plans"
                          value={JSON.stringify(v)}
                        >
                          PRICE:{v.price} VALIDITY :{v.validity} Data:
                          {v.options}
                        </option>
                      );
                    })}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="num">
                  <label htmlFor="ExistingValidityOne">
                    Enter Existing Plan Validity Days For Number 1
                  </label>

                  <input
                    type="number"
                    name="ExistingValidityOne"
                    id="ExistingValidityOne"
                    min={0}
                    max={365}
                    onChange={handleChange}
                    value={profileEdit.ExistingValidityOne}
                    placeholder="Existing Validity "
                  />
                  <p>Error Meassage</p>
                </div>
              </div>
              <hr />

              <div className="responsive">
                <div className="num">
                  <label htmlFor="rechNum2">Recharge For Number 2</label>

                  <input
                    type="number"
                    onChange={handleChange}
                    name="rechNum2"
                    id="rechNum2"
                    value={profileEdit.rechNum2}
                    placeholder="Recharge num 2"
                  />
                  <p>{notify.num2}</p>
                </div>
                <div className="opera">
                  <label htmlFor="opera2">Select Operator For Number 2</label>

                  <select
                    value={profileEdit.opera2}
                    onChange={handleChange}
                    name="opera2"
                    id="opera2"
                  >
                    <option value="">Select Operator</option>
                    {InitialOptions.operators.map((v, i) => {
                      return (
                        <option key={i} value={v}>
                          {v}
                        </option>
                      );
                    })}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="opera">
                  <label htmlFor="state2">Select State For Number 2</label>

                  <select
                    value={profileEdit.state2}
                    onChange={handleChange}
                    name="state2"
                    id="state2"
                  >
                    <option value="">Select State</option>
                    {InitialOptions.states.map((v, i) => {
                      return (
                        <option key={i} value={v}>
                          {v}
                        </option>
                      );
                    })}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="opera">
                  <label htmlFor="SelectedPlan2">
                    Select A Plan For Number 2
                  </label>
                  <select
                    onChange={handleChange}
                    name="SelectedPlan2"
                    id="SelectedPlan2"
                  >
                    <option value="">Select Plan</option>
                    {curOpera2.map((v, i) => {
                      return (
                        <option
                          key={i}
                          className="plans"
                          value={JSON.stringify(v)}
                        >
                          PRICE:{v.price} VALIDITY :{v.validity} Data:
                          {v.options}
                        </option>
                      );
                    })}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="num">
                  <label htmlFor="ExistingValiditytwo">
                    Enter Existing Plan Validity Days For Number 2
                  </label>

                  <input
                    type="number"
                    name="ExistingValiditytwo"
                    id="ExistingValiditytwo"
                    min={0}
                    max={365}
                    onChange={handleChange}
                    value={profileEdit.ExistingValiditytwo}
                    placeholder="Existing Validity "
                  />
                  <p>Error Meassage</p>
                </div>
              </div>
              <hr />

              <div className="responsive">
                <div className="num">
                  <label htmlFor="rechNum3">Recharge For Number 3</label>

                  <input
                    type="number"
                    onChange={handleChange}
                    name="rechNum3"
                    id="rechNum3"
                    value={profileEdit.rechNum3}
                    placeholder="Recharge num 3"
                  />
                  <p>{notify.num3}</p>
                </div>
                <div className="opera">
                  <label htmlFor="opera3">Select Operator For Number 3</label>

                  <select
                    value={profileEdit.opera3}
                    onChange={handleChange}
                    name="opera3"
                    id="opera3"
                  >
                    <option value="">Select Operator</option>
                    {InitialOptions.operators.map((v, i) => {
                      return (
                        <option key={i} value={v}>
                          {v}
                        </option>
                      );
                    })}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="opera">
                  <label htmlFor="state3">Select State For Number 3</label>

                  <select
                    value={profileEdit.state3}
                    onChange={handleChange}
                    name="state3"
                    id="state3"
                  >
                    <option value="">Select State</option>
                    {InitialOptions.states.map((v, i) => {
                      return (
                        <option key={i} value={v}>
                          {v}
                        </option>
                      );
                    })}{" "}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="opera">
                  <label htmlFor="SelectedPlan3">
                    Select A Plan For Number 3
                  </label>

                  <select
                    onChange={handleChange}
                    name="SelectedPlan3"
                    id="SelectedPlan3"
                  >
                    <option value="">Select Plan</option>
                    {curOpera3.map((v, i) => {
                      return (
                        <option
                          key={i}
                          className="plans"
                          value={JSON.stringify(v)}
                        >
                          PRICE:{v.price} VALIDITY :{v.validity} Data:
                          {v.options}
                        </option>
                      );
                    })}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="num">
                  <label htmlFor="ExistingValiditythree">
                    Enter Existing Plan Validity Days For Number 3
                  </label>
                  <input
                    type="number"
                    name="ExistingValiditythree"
                    id="ExistingValiditythree"
                    min={0}
                    max={365}
                    onChange={handleChange}
                    value={profileEdit.ExistingValiditythree}
                    placeholder="Existing Validity "
                  />
                  useEffect
                  <p>Error Meassage</p>
                </div>
              </div>
            </div>
            <div className="rech-for-num">
              <h2>Accounts Information</h2>
              <div className="responsive">
                <div className="select-box">
                  <label htmlFor="transactionMethod">
                    Select Transaction Method
                  </label>
                  <select
                    onChange={handleChange}
                    value={profileEdit.transactionMethod}
                    name="transactionMethod"
                    id="transactionMethod"
                  >
                    <option value="">Select Transaction Method</option>
                    {InitialOptions.transactionMethods.map((method, i) => {
                      return (
                        <option key={i} value={method}>
                          {method}
                        </option>
                      );
                    })}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="input-text">
                  <label htmlFor="transactionMethod">
                    Enter UPI ID/UPI Phone Number
                  </label>

                  <input
                    onChange={handleChange}
                    name="upi"
                    id=""
                    value={profileEdit.upi}
                    placeholder="upi"
                  />
                  <p>Error Meassage</p>
                </div>
                <div className="input-text">
                  <label htmlFor="transactionMethod">IFSC Code</label>

                  <input
                    onChange={handleChange}
                    name="ifsc"
                    id=""
                    value={profileEdit.ifsc}
                    placeholder="IFSC code"
                  />
                  <p>Error Meassage</p>
                </div>
                <div className="input-text">
                  <label htmlFor="transactionMethod">Account Number</label>

                  <input
                    onChange={handleChange}
                    name="bank"
                    id=""
                    value={profileEdit.bank}
                    placeholder="Account number"
                  />
                  <p>Error Meassage</p>
                </div>
                <div className="input-text">
                  <label htmlFor="transactionMethod">
                    Confirm Account Number
                  </label>

                  <input
                    onChange={handleChange}
                    name="confirmBank"
                    id=""
                    value={profileEdit.confirmBank}
                    placeholder="Confirm Account number"
                  />
                  <p>Error Meassage</p>
                </div>
              </div>
            </div>

            <div className="priority-order">
              <h2> priority order </h2>

              <div className="priority">
                {priority.map((v, i) => {
                  if (v === "withdraw") {
                    return (
                      <div key={i} className="order">
                        <div className="title">
                          <span>Auto withdraw</span>
                          <input
                            onChange={() =>
                              setProfileEdit({
                                ...profileEdit,
                                autoWithdraw: !profileEdit.autoWithdraw,
                              })
                            }
                            checked={profileEdit.autoWithdraw}
                            type="checkbox"
                            name="autoWithdraw"
                            id="autoWithdraw"
                          />
                          <label htmlFor="autoWithdraw">On</label>

                          <input
                            type="range"
                            name="withdraw_perc"
                            id=""
                            min="1"
                            max="100"
                            onChange={handleChange}
                            value={profileEdit.withdraw_perc}
                            style={{
                              accentColor: profileEdit.autoWithdraw
                                ? "#0b5aee"
                                : "gray",
                            }}
                          />
                          <span>{profileEdit.withdraw_perc}%</span>
                        </div>

                        <div className="arrow">
                          <div
                            onClick={() => moveMe(priority, "up", i)}
                            className="up"
                          >
                            ⬆️
                          </div>
                          <div
                            onClick={() => moveMe(priority, "down", i)}
                            className="down"
                          >
                            ⬇️
                          </div>
                        </div>
                      </div>
                    );
                  } else if (v === "nextInvest") {
                    return (
                      <div className="order">
                        <div className="title">
                          <span>Auto Reserve for next invest</span>
                          <input
                            onChange={() =>
                              setProfileEdit({
                                ...profileEdit,
                                NextInvest: !profileEdit.NextInvest,
                              })
                            }
                            checked={profileEdit.NextInvest}
                            type="checkbox"
                            name="NextInvest"
                            id="NextInvest"
                          />
                          <label htmlFor="NextInvest"> On</label>
                        </div>

                        <div className="arrow">
                          <div
                            onClick={() => moveMe(priority, "up", i)}
                            className="up"
                          >
                            ⬆️
                          </div>
                          <div
                            onClick={() => moveMe(priority, "down", i)}
                            className="down"
                          >
                            ⬇️
                          </div>
                        </div>
                      </div>
                    );
                  } else
                    return (
                      <div className="order">
                        <div className="title">
                          <span>Auto recharge All Numbers</span>
                          <input
                            onChange={() =>
                              setProfileEdit({
                                ...profileEdit,
                                autoRecharge: !profileEdit.autoRecharge,
                              })
                            }
                            checked={profileEdit.autoRecharge}
                            type="checkbox"
                            name="autoRecharge"
                            id="autoRecharge"
                          />
                          <label htmlFor="autoRecharge">On</label>
                        </div>

                        <div className="arrow">
                          <div
                            onClick={() => moveMe(priority, "up", i)}
                            className="up"
                          >
                            ⬆️
                          </div>
                          <div
                            onClick={() => moveMe(priority, "down", i)}
                            className="down"
                          >
                            ⬇️
                          </div>
                        </div>
                      </div>
                    );
                })}
              </div>
            </div>

            <div>
              <NavLink to="/password-set">
                {MyDetails.password ? "Change Password" : "Set New Password"}{" "}
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default Profile;
