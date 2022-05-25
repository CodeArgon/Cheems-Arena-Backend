import Images from "../../Constants/ImgConstants";

export const CLIENT_SIDEBAR = [
  {
    img: (
      <img style={{ width: "35px" }} alt={""} src={Images.DASHBOARD_IMAGE} />
    ),
    label: "Dashboard",
    // action: "/",
    PostModal: false,
    action: "/dashboard",
  },
  {
    img: <img style={{ width: "35px" }} alt={""} src={Images.DASHBOARD_IMAGE} />,
    label: "Users",
    action: "/users",
    PostModal: false,
  },
  {
    img: <img style={{ width: "35px" }} alt={""} src={Images.DASHBOARD_IMAGE} />,
    label: "Posts",
    action: "/adminposts",
    PostModal: false,
  },
  {
    img: <img style={{ width: "35px" }} alt={""} src={Images.DASHBOARD_IMAGE} />,
    label: "Donations",
    action: "/admindonations",
    PostModal: false,
  },
  {
    img: <img style={{ width: "35px" }} alt={""} src={Images.DASHBOARD_IMAGE} />,
    label: "Tags",
    action: "/tags",
    PostModal: false,
  },
];
