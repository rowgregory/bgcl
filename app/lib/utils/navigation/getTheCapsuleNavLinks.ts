const getTheCapsuleNavLinks = (path: string) => [
  {
    textKey: "The Core",
    linkKey: "/admin/capsule/core",
    isActive: path === "/admin/capsule/core",
  },
  {
    textKey: "Manifest",
    linkKey: "/admin/capsule/manifest",
    isActive: path === "/admin/capsule/manifest",
  },
  {
    textKey: "Revenue Bay",
    linkKey: "/admin/capsule/revenue-bay",
    isActive: path === "/admin/capsule/revenue-bay",
  },
  {
    textKey: "Gate Control",
    linkKey: "/admin/capsule/gate-control",
    isActive: path === "/admin/capsule/gate-control",
  },
  {
    textKey: "Intel Hub",
    linkKey: "/admin/capsule/intel-hub",
    isActive: path === "/admin/capsule/intel-hub",
  },
];

export default getTheCapsuleNavLinks;
